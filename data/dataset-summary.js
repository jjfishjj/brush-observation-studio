window.DATASET_REFERENCE = {
  "schema_version": 1,
  "dataset_title": "A new multi-modal dataset for Dental Plaque Diagnosis of Patients With Fixed Labial Orthodontic Appliances",
  "generated_from": "Original image labels only; any filename with an augmentation/noise suffix after patient-date-view is excluded.",
  "field_order": [
    "class_id",
    "center_x",
    "center_y",
    "width",
    "height",
    "tooth_internal_id"
  ],
  "coordinate_format": "center_x、center_y、width、height 均觀察為 0–1 正規化值；已用配對原圖疊框核對，符合 YOLO 中心點與寬高格式。",
  "annotation_sample": {
    "part": "Part 1",
    "raw_line": "1 0.475080 0.647476 0.053686 0.115144 14",
    "paired_image_size": "6240 × 4160",
    "overlay_verified": true
  },
  "label_validation": {
    "all_rows_six_fields": true,
    "coordinates_normalized_0_1": true,
    "patient_split_isolation_verified": true,
    "mapping_identical_across_parts": true
  },
  "class_semantics_note": "論文與資料集頁面對 class 語義的描述不同；本原型保留原始 class ID，不推論臨床意義。",
  "license": "CC BY 4.0",
  "sources": {
    "dataset_descriptor": "https://www.sciencedirect.com/science/article/pii/S2352340926003859",
    "part1": "https://data.mendeley.com/datasets/g8yhdvgjy2/3",
    "part2": "https://data.mendeley.com/datasets/xjs4bfgzj5/3",
    "license_url": "https://creativecommons.org/licenses/by/4.0/"
  },
  "parts": {
    "part1": {
      "title": "AIRC-LABDEN Part 1",
      "url": "https://data.mendeley.com/datasets/g8yhdvgjy2/3",
      "archive_sha256": "9db56489882587be2e4c0d5cece64624aa1f3d979d1e0c7bbc8d8d6427d2f67f",
      "split_label_column": "status",
      "label_files_total": 5276,
      "label_files_nonempty": 5268,
      "original_image_label_files": 664,
      "variant_suffixes_excluded": {
        "blur": 74,
        "blur_brightness-down": 74,
        "blur_brightness-up": 74,
        "blur_flip_horizontal": 74,
        "blur_rotate-left-15": 74,
        "blur_rotate-right-15": 74,
        "brightness-down": 656,
        "brightness-up": 656,
        "dark": 74,
        "dark_brightness-down": 74,
        "dark_brightness-up": 74,
        "dark_flip_horizontal": 74,
        "dark_rotate-left-15": 74,
        "dark_rotate-right-15": 74,
        "flip_horizontal": 656,
        "light": 74,
        "light_brightness-down": 74,
        "light_brightness-up": 74,
        "light_flip_horizontal": 74,
        "light_rotate-left-15": 74,
        "light_rotate-right-15": 74,
        "rotate-left-15": 656,
        "rotate-right-15": 656
      },
      "original_images_by_split": {
        "test": 99,
        "train": 466,
        "validation": 99
      },
      "patients_by_split": {
        "test": 11,
        "train": 52,
        "validation": 11
      },
      "patient_split_overlap": [],
      "original_annotations": 8240,
      "class_counts": {
        "0": 191,
        "1": 8049
      },
      "by_split": {
        "test": {
          "images": 99,
          "patients": 11,
          "annotations": 1224,
          "class_counts": {
            "0": 33,
            "1": 1191
          }
        },
        "train": {
          "images": 466,
          "patients": 52,
          "annotations": 5796,
          "class_counts": {
            "0": 151,
            "1": 5645
          }
        },
        "validation": {
          "images": 99,
          "patients": 11,
          "annotations": 1220,
          "class_counts": {
            "0": 7,
            "1": 1213
          }
        }
      },
      "by_tooth_id": {
        "1": {
          "0": 22,
          "1": 854
        },
        "2": {
          "0": 6,
          "1": 254
        },
        "3": {
          "0": 22,
          "1": 766
        },
        "4": {
          "0": 16,
          "1": 276
        },
        "5": {
          "0": 2,
          "1": 74
        },
        "6": {
          "0": 28,
          "1": 848
        },
        "7": {
          "1": 292
        },
        "8": {
          "0": 14,
          "1": 654
        },
        "9": {
          "0": 13,
          "1": 319
        },
        "10": {
          "0": 1,
          "1": 79
        },
        "11": {
          "0": 8,
          "1": 564
        },
        "12": {
          "1": 152
        },
        "13": {
          "0": 8,
          "1": 452
        },
        "14": {
          "0": 6,
          "1": 382
        },
        "15": {
          "0": 2,
          "1": 206
        },
        "16": {
          "0": 8,
          "1": 596
        },
        "17": {
          "0": 4,
          "1": 200
        },
        "18": {
          "0": 10,
          "1": 510
        },
        "19": {
          "0": 12,
          "1": 396
        },
        "20": {
          "0": 9,
          "1": 175
        }
      },
      "coordinate_ranges": {
        "center_x": {
          "min": 0.16851,
          "max": 0.83742
        },
        "center_y": {
          "min": 0.115264,
          "max": 0.931731
        },
        "width": {
          "min": 0.001923,
          "max": 0.194231
        },
        "height": {
          "min": 0.0,
          "max": 0.168029
        }
      },
      "coordinate_bbox_outside_0_1": 0,
      "rows_with_unexpected_column_count": {},
      "unknown_tooth_id_counts": {},
      "unpaired_original_image_label_files": []
    },
    "part2": {
      "title": "AIRC-LABDEN Part 2",
      "url": "https://data.mendeley.com/datasets/xjs4bfgzj5/3",
      "archive_sha256": "528aa29826a87dbd132c32cb802e4f5f75f37401c1afaeadd997af611b9fdfc2",
      "split_label_column": "Recommend",
      "label_files_total": 5174,
      "label_files_nonempty": 5160,
      "original_image_label_files": 655,
      "variant_suffixes_excluded": {
        "blur": 73,
        "blur_brightness-down": 71,
        "blur_brightness-up": 71,
        "blur_flip_horizontal": 71,
        "blur_rotate-left-15": 71,
        "blur_rotate-right-15": 71,
        "brightness-down": 645,
        "brightness-up": 645,
        "dark": 73,
        "dark_brightness-down": 72,
        "dark_brightness-up": 72,
        "dark_flip_horizontal": 72,
        "dark_rotate-left-15": 72,
        "dark_rotate-right-15": 72,
        "flip_horizontal": 645,
        "light": 73,
        "light_brightness-down": 72,
        "light_brightness-up": 72,
        "light_flip_horizontal": 72,
        "light_rotate-left-15": 72,
        "light_rotate-right-15": 72,
        "rotate-left-15": 645,
        "rotate-right-15": 645
      },
      "original_images_by_split": {
        "test": 108,
        "train": 484,
        "validation": 63
      },
      "patients_by_split": {
        "test": 12,
        "train": 55,
        "validation": 7
      },
      "patient_split_overlap": [],
      "original_annotations": 7692,
      "class_counts": {
        "0": 151,
        "1": 7541
      },
      "by_split": {
        "test": {
          "images": 108,
          "patients": 12,
          "annotations": 1328,
          "class_counts": {
            "0": 23,
            "1": 1305
          }
        },
        "train": {
          "images": 484,
          "patients": 55,
          "annotations": 5648,
          "class_counts": {
            "0": 124,
            "1": 5524
          }
        },
        "validation": {
          "images": 63,
          "patients": 7,
          "annotations": 716,
          "class_counts": {
            "0": 4,
            "1": 712
          }
        }
      },
      "by_tooth_id": {
        "1": {
          "0": 20,
          "1": 796
        },
        "2": {
          "0": 5,
          "1": 283
        },
        "3": {
          "0": 18,
          "1": 666
        },
        "4": {
          "0": 8,
          "1": 236
        },
        "5": {
          "1": 52
        },
        "6": {
          "0": 19,
          "1": 789
        },
        "7": {
          "0": 2,
          "1": 202
        },
        "8": {
          "0": 6,
          "1": 654
        },
        "9": {
          "0": 4,
          "1": 268
        },
        "10": {
          "0": 1,
          "1": 55
        },
        "11": {
          "0": 10,
          "1": 578
        },
        "12": {
          "0": 3,
          "1": 165
        },
        "13": {
          "0": 6,
          "1": 502
        },
        "14": {
          "0": 6,
          "1": 354
        },
        "15": {
          "0": 2,
          "1": 82
        },
        "16": {
          "0": 16,
          "1": 580
        },
        "17": {
          "0": 7,
          "1": 209
        },
        "18": {
          "0": 11,
          "1": 569
        },
        "19": {
          "0": 6,
          "1": 386
        },
        "20": {
          "0": 1,
          "1": 115
        }
      },
      "coordinate_ranges": {
        "center_x": {
          "min": 0.180208,
          "max": 0.901923
        },
        "center_y": {
          "min": 0.023438,
          "max": 0.939543
        },
        "width": {
          "min": 0.0,
          "max": 0.225641
        },
        "height": {
          "min": 0.0,
          "max": 0.172837
        }
      },
      "coordinate_bbox_outside_0_1": 0,
      "rows_with_unexpected_column_count": {},
      "unknown_tooth_id_counts": {},
      "unpaired_original_image_label_files": []
    }
  },
  "tooth_categories": [
    {
      "internal_id": 1,
      "fdi": "11",
      "supercategory": "objects"
    },
    {
      "internal_id": 2,
      "fdi": "12",
      "supercategory": "objects"
    },
    {
      "internal_id": 3,
      "fdi": "13",
      "supercategory": "objects"
    },
    {
      "internal_id": 4,
      "fdi": "14",
      "supercategory": "objects"
    },
    {
      "internal_id": 5,
      "fdi": "15",
      "supercategory": "objects"
    },
    {
      "internal_id": 6,
      "fdi": "21",
      "supercategory": "objects"
    },
    {
      "internal_id": 7,
      "fdi": "22",
      "supercategory": "objects"
    },
    {
      "internal_id": 8,
      "fdi": "23",
      "supercategory": "objects"
    },
    {
      "internal_id": 9,
      "fdi": "24",
      "supercategory": "objects"
    },
    {
      "internal_id": 10,
      "fdi": "25",
      "supercategory": "objects"
    },
    {
      "internal_id": 11,
      "fdi": "31",
      "supercategory": "objects"
    },
    {
      "internal_id": 12,
      "fdi": "32",
      "supercategory": "objects"
    },
    {
      "internal_id": 13,
      "fdi": "33",
      "supercategory": "objects"
    },
    {
      "internal_id": 14,
      "fdi": "34",
      "supercategory": "objects"
    },
    {
      "internal_id": 15,
      "fdi": "35",
      "supercategory": "objects"
    },
    {
      "internal_id": 16,
      "fdi": "41",
      "supercategory": "objects"
    },
    {
      "internal_id": 17,
      "fdi": "42",
      "supercategory": "objects"
    },
    {
      "internal_id": 18,
      "fdi": "43",
      "supercategory": "objects"
    },
    {
      "internal_id": 19,
      "fdi": "44",
      "supercategory": "objects"
    },
    {
      "internal_id": 20,
      "fdi": "45",
      "supercategory": "objects"
    },
    {
      "internal_id": 21,
      "fdi": "brace",
      "supercategory": "objects"
    }
  ],
  "tooth_mapping_source": "metadata/teeth_position_mapping.json in Mendeley AIRC-LABDEN Part 1",
  "non_tooth_categories": [
    {
      "internal_id": 21,
      "fdi": "brace",
      "supercategory": "objects"
    }
  ],
  "attribution": {
    "authors": "Chi Nguyen Anh; Hai Pham Nhu; Lam Vu Ngoc; Hoang Bui Duy; Duc Nguyen Minh; Quan Phung Hong",
    "license": "CC BY 4.0",
    "license_url": "https://creativecommons.org/licenses/by/4.0/",
    "changes": "Derived annotation summaries; only original image label files were counted, and class IDs were kept unchanged."
  },
  "original_only_filter": "Filenames with exactly patient-date-view fields were counted; any suffix after view was excluded as an augmentation/noise variant."
};
