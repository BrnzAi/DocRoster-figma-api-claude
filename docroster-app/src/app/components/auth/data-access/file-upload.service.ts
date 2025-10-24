import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  
  /**
   * Upload a file (currently mocked for future implementation)
   * @param file The file to upload
   * @param type The type of upload (profile, document, etc.)
   * @returns Observable with upload result
   */
  uploadFile(file: File, type: 'profile' | 'document' = 'profile'): Observable<UploadResult> {
    // Validate file
    if (!this.isValidFile(file, type)) {
      return of({ 
        success: false, 
        error: 'Invalid file type or size' 
      });
    }

    // Mock upload - replace with actual API call in production
    return of({
      success: true,
      url: URL.createObjectURL(file) // Temporary local URL
    }).pipe(delay(500)); // Simulate network delay
  }

  /**
   * Validate file based on type
   */
  private isValidFile(file: File, type: 'profile' | 'document'): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (file.size > maxSize) {
      return false;
    }

    const allowedTypes: { [key: string]: string[] } = {
      profile: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      document: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    };

    return allowedTypes[type].includes(file.type);
  }

  /**
   * Convert file to base64 for preview
   */
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}
