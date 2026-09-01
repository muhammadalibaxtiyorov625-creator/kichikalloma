const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Ta\'lim Platformasi & Rivojlanish Sayyoralari API',
    version: '1.0.0',
    description: `Bolalar ta'limi va rivojlanishi platformasi uchun **Rasmli 8 ta Sayyora (Planets)**, **Qulayliklar (Amenities)** va mijozlar **Xabarlari (Messages)** REST API tizimi.

### 🪐 8 Ta Rivojlanish Sayyoralari (Rasmlari bilan):
1. **FIKRLASH VA BILIM** (Rasm: \`/images/planets/earth.svg\`) — *Masalani tushunish, yechimni topish.*
2. **NUTQ VA TIL** (Rasm: \`/images/planets/mars.svg\`) — *Fikrni aniq ifodalashni o'rganish.*
3. **O'ZINI BOSHQARISH** (Rasm: \`/images/planets/cyan-rings.svg\`) — *Kichik odatlar katta natijalarga olib boradi.*
4. **HISSIYOTLARNI ANGLASH** (Rasm: \`/images/planets/coral.svg\`) — *O'zini his qilishni tushunish, anglash.*
5. **IJODKORLIK VA TASAVVUR** (Rasm: \`/images/planets/deep-blue.svg\`) — *Yangi g'oyalar yaratish uchun makon.*
6. **IJTIMOIY KO'NIKMALAR** (Rasm: \`/images/planets/saturn.svg\`) — *Birgalikda o'rganish va muloqot qilish.*
7. **HARAKAT VA SOG'LIK** (Rasm: \`/images/planets/purple.svg\`) — *O'rganish orasida harakat ham kerak.*
8. **QADRIYAT VA MAS'ULIYAT** (Rasm: \`/images/planets/teal-moon.svg\`) — *Har bir tanlovning oqibati bor.*`,
    contact: {
      name: 'Admin API Boshqaruvi',
      email: 'support@adminportal.uz'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Lokal server'
    }
  ],
  tags: [
    {
      name: 'Sayyoralar (Planets)',
      description: 'Rasmli 8 ta ta\'limiy sayyoralarni olish, qo\'shish (rasm bilan), tahrirlash va o\'chirish'
    },
    {
      name: 'Qulayliklar (Amenities)',
      description: 'Ta\'limiy qulayliklar boshqaruvi'
    },
    {
      name: 'Xabarlar (Messages)',
      description: 'Mijozlardan kelgan xabarlarni qabul qilish va boshqarish'
    },
    {
      name: 'Statistika (Stats)',
      description: 'Admin panel hisobotlari'
    }
  ],
  paths: {
    '/api/stats': {
      get: {
        tags: ['Statistika (Stats)'],
        summary: 'Admin panel statistikasini olish',
        responses: {
          200: {
            description: 'Statistika hisoboti',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totalPlanets: { type: 'integer', example: 8 },
                    activePlanets: { type: 'integer', example: 8 },
                    totalAmenities: { type: 'integer', example: 5 },
                    totalMessages: { type: 'integer', example: 4 },
                    unreadMessages: { type: 'integer', example: 2 }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/planets': {
      get: {
        tags: ['Sayyoralar (Planets)'],
        summary: 'Barcha sayyoralar ro\'yxatini olish (Rasmli JSON)',
        description: 'Barcha 8 ta rivojlanish sayyoralarini rasm manzillari (image) bilan birga qaytaradi.',
        responses: {
          200: {
            description: 'Rasmli sayyoralar ro\'yxati',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Planet'
                  }
                },
                example: [
                  {
                    "id": 1,
                    "title": "FIKRLASH VA BILIM",
                    "description": "Masalani tushunish, yechimni topish.",
                    "image": "/images/planets/earth.svg",
                    "status": "active",
                    "created_at": "2026-08-18 10:00:00"
                  },
                  {
                    "id": 2,
                    "title": "NUTQ VA TIL",
                    "description": "Fikrni aniq ifodalashni o'rganish.",
                    "image": "/images/planets/mars.svg",
                    "status": "active",
                    "created_at": "2026-08-18 10:00:00"
                  },
                  {
                    "id": 3,
                    "title": "O'ZINI BOSHQARISH",
                    "description": "Kichik odatlar katta natijalarga olib boradi.",
                    "image": "/images/planets/cyan-rings.svg",
                    "status": "active",
                    "created_at": "2026-08-18 10:00:00"
                  },
                  {
                    "id": 4,
                    "title": "HISSIYOTLARNI ANGLASH",
                    "description": "O'zini his qilishni tushunish, anglash.",
                    "image": "/images/planets/coral.svg",
                    "status": "active",
                    "created_at": "2026-08-18 10:00:00"
                  },
                  {
                    "id": 5,
                    "title": "IJODKORLIK VA TASAVVUR",
                    "description": "Yangi g'oyalar yaratish uchun makon.",
                    "image": "/images/planets/deep-blue.svg",
                    "status": "active",
                    "created_at": "2026-08-18 10:00:00"
                  },
                  {
                    "id": 6,
                    "title": "IJTIMOIY KO'NIKMALAR",
                    "description": "Birgalikda o'rganish va muloqot qilish.",
                    "image": "/images/planets/saturn.svg",
                    "status": "active",
                    "created_at": "2026-08-18 10:00:00"
                  },
                  {
                    "id": 7,
                    "title": "HARAKAT VA SOG'LIK",
                    "description": "O'rganish orasida harakat ham kerak.",
                    "image": "/images/planets/purple.svg",
                    "status": "active",
                    "created_at": "2026-08-18 10:00:00"
                  },
                  {
                    "id": 8,
                    "title": "QADRIYAT VA MAS'ULIYAT",
                    "description": "Har bir tanlovning oqibati bor.",
                    "image": "/images/planets/teal-moon.svg",
                    "status": "active",
                    "created_at": "2026-08-18 10:00:00"
                  }
                ]
              }
            }
          }
        }
      },
      post: {
        tags: ['Sayyoralar (Planets)'],
        summary: 'Yangi sayyora qo\'shish (Rasm bilan)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { 
                    type: 'string', 
                    example: 'FIKRLASH VA BILIM',
                    description: 'Sayyora nomi'
                  },
                  description: { 
                    type: 'string', 
                    example: 'Masalani tushunish, yechimni topish.',
                    description: 'Sayyora vazifasi va tavsifi'
                  },
                  image: { 
                    type: 'string', 
                    example: '/images/planets/earth.svg',
                    description: 'Sayyora rasmining URL manzili yoki /images/planets/earth.svg, mars.svg, cyan-rings.svg, coral.svg, deep-blue.svg, saturn.svg, purple.svg, teal-moon.svg'
                  },
                  status: { 
                    type: 'string', 
                    enum: ['active', 'inactive'], 
                    example: 'active'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Sayyora rasmi bilan muvaffaqiyatli yaratildi',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Planet'
                }
              }
            }
          },
          400: { description: 'Sayyora nomi kiritilmagan' }
        }
      }
    },
    '/api/planets/{id}': {
      put: {
        tags: ['Sayyoralar (Planets)'],
        summary: 'Sayyorani yangilash / tahrirlash (Rasm bilan)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Sayyora ID si'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'FIKRLASH VA BILIM' },
                  description: { type: 'string', example: 'Masalani tushunish, yechimni topish.' },
                  image: { type: 'string', example: '/images/planets/earth.svg' },
                  status: { type: 'string', enum: ['active', 'inactive'], example: 'active' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Sayyora yangilandi' },
          404: { description: 'Sayyora topilmadi' }
        }
      },
      delete: {
        tags: ['Sayyoralar (Planets)'],
        summary: 'Sayyorani o\'chirish',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Sayyora ID si'
          }
        ],
        responses: {
          200: { description: 'Sayyora o\'chirildi' },
          404: { description: 'Sayyora topilmadi' }
        }
      }
    },
    '/api/amenities': {
      get: {
        tags: ['Qulayliklar (Amenities)'],
        summary: 'Barcha qulayliklarni olish',
        responses: {
          200: {
            description: 'Qulayliklar ro\'yxati',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Amenity' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Qulayliklar (Amenities)'],
        summary: 'Yangi qulaylik qo\'shish',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', example: 'Ota-ona nazorati' },
                  description: { type: 'string', example: 'Farzandingizning kunlik va haftalik faolligini kuzatib boring.' },
                  status: { type: 'string', enum: ['active', 'inactive'], example: 'active' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Qulaylik yaratildi' }
        }
      }
    },
    '/api/amenities/{id}': {
      put: {
        tags: ['Qulayliklar (Amenities)'],
        summary: 'Qulaylikni yangilash',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Ota-ona nazorati' },
                  description: { type: 'string', example: 'Yangilangan tavsif' },
                  status: { type: 'string', enum: ['active', 'inactive'], example: 'active' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Qulaylik yangilandi' },
          404: { description: 'Qulaylik topilmadi' }
        }
      },
      delete: {
        tags: ['Qulayliklar (Amenities)'],
        summary: 'Qulaylikni o\'chirish',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Qulaylik o\'chirildi' }
        }
      }
    },
    '/api/messages': {
      get: {
        tags: ['Xabarlar (Messages)'],
        summary: 'Kelgan xabarlar ro\'yxati',
        responses: {
          200: {
            description: 'Xabarlar ro\'yxati',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Message' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Xabarlar (Messages)'],
        summary: 'Yangi xabar qoldirish (Ismi, Telefon, Xabari)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'phone', 'message'],
                properties: {
                  name: { type: 'string', example: 'Anvar Qodirov' },
                  phone: { type: 'string', example: '+998 90 123 45 67' },
                  message: { type: 'string', example: 'Sayyoralar dasturi bo\'yicha ma\'lumot bering.' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Xabar saqlandi' }
        }
      }
    },
    '/api/messages/{id}/read': {
      patch: {
        tags: ['Xabarlar (Messages)'],
        summary: 'Xabarni o\'qilgan deb belgilash',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Xabar o\'qilgan deb belgilandi' }
        }
      }
    },
    '/api/messages/{id}': {
      delete: {
        tags: ['Xabarlar (Messages)'],
        summary: 'Xabarni o\'chirish',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Xabar o\'chirildi' }
        }
      }
    }
  },
  components: {
    schemas: {
      Planet: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'FIKRLASH VA BILIM' },
          description: { type: 'string', example: 'Masalani tushunish, yechimni topish.' },
          image: { type: 'string', example: '/images/planets/earth.svg', description: 'Sayyora rasmining manzili yoki URL' },
          status: { type: 'string', example: 'active' },
          created_at: { type: 'string', example: '2026-08-18 10:00:00' }
        }
      },
      Amenity: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Ota-ona nazorati' },
          description: { type: 'string', example: 'Farzandingizning kunlik va haftalik faolligini kuzatib boring.' },
          status: { type: 'string', example: 'active' },
          created_at: { type: 'string', example: '2026-08-18 10:00:00' }
        }
      },
      Message: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Anvar Qodirov' },
          phone: { type: 'string', example: '+998 90 123 45 67' },
          message: { type: 'string', example: 'Sayyoralar haqida batafsil ma\'lumot...' },
          is_read: { type: 'integer', example: 0 },
          created_at: { type: 'string', example: '2026-08-18 10:30:00' }
        }
      }
    }
  }
};

module.exports = swaggerDefinition;
