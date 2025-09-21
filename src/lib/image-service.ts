import { createClient } from "./supabase";

export class ImageService {
  private static supabase = createClient();
  private static BUCKET_NAME = "vote-images";

  static async uploadImage(
    file: File,
    voteId: string,
    optionIndex: number
  ): Promise<string> {
    const supabase = this.supabase;

    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const allowedTypes = ["jpg", "jpeg", "png", "gif", "webp"];

      if (!fileExt || !allowedTypes.includes(fileExt)) {
        throw new Error("지원하지 않는 이미지 형식입니다. (jpg, png, gif, webp만 가능)");
      }

      if (file.size > 1024 * 1024) {
        throw new Error("이미지 크기는 1MB 이하여야 합니다.");
      }

      const compressedFile = await this.compressImage(file);

      const fileName = `${voteId}/${optionIndex}-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, compressedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      return this.fallbackToBase64(file);
    }
  }

  private static compressImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); 
            }
          },
          file.type,
          0.8 
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  private static fallbackToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (file.size > 100 * 1024) {
        reject(new Error("Storage를 사용할 수 없어 파일 크기를 100KB 이하로 제한합니다."));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Base64 변환 실패"));
      reader.readAsDataURL(file);
    });
  }

  static async deleteImage(imageUrl: string): Promise<void> {
    const supabase = this.supabase;

    try {
      if (!imageUrl.includes(this.BUCKET_NAME)) {
        return;
      }

      const urlParts = imageUrl.split(`/${this.BUCKET_NAME}/`);
      if (urlParts.length !== 2) {
        throw new Error("유효하지 않은 이미지 URL입니다.");
      }

      const filePath = urlParts[1];
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) throw error;
    } catch (error: any) {
      console.error("이미지 삭제 실패:", error.message);
    }
  }

  static async deleteVoteImages(voteId: string): Promise<void> {
    const supabase = this.supabase;

    try {
      const { data: files, error: listError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(voteId);

      if (listError) throw listError;

      if (files && files.length > 0) {
        const filePaths = files.map((file) => `${voteId}/${file.name}`);

        const { error: deleteError } = await supabase.storage
          .from(this.BUCKET_NAME)
          .remove(filePaths);

        if (deleteError) throw deleteError;
      }
    } catch (error: any) {
      console.error("투표 이미지 삭제 실패:", error.message);
    }
  }

  static async optimizeImage(
    file: File,
    maxWidth: number = 800,
    maxHeight: number = 600,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("이미지 최적화에 실패했습니다."));
              return;
            }

            const optimizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(optimizedFile);
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error("이미지 로드에 실패했습니다."));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  static createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  static revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  static async initializeBucket(): Promise<void> {
    const supabase = this.supabase;

    try {
      const { error } = await supabase.storage.createBucket(this.BUCKET_NAME, {
        public: true,
        allowedMimeTypes: [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ],
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      });

      if (error && !error.message.includes("already exists")) {
        throw error;
      }

    } catch (error: any) {
      console.error("버킷 초기화 실패:", error.message);
      throw error;
    }
  }
}
