/* eslint-disable prettier/prettier */
export type Sol998 = {
  version: '0.1.0';
  name: 'sol998';
  instructions: [
    {
      name: 'initialize';
      accounts: [];
      args: [];
    },
    {
      name: 'mintHeroPre';
      accounts: [
        {
          name: 'heroMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'name';
          type: 'string';
        },
        {
          name: 'symbol';
          type: 'string';
        },
        {
          name: 'uri';
          type: 'string';
        }
      ];
    },
    {
      name: 'mintHero';
      accounts: [
        {
          name: 'heroMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'heroMintTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'heroMetadataAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'mplProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'name';
          type: 'string';
        },
        {
          name: 'symbol';
          type: 'string';
        },
        {
          name: 'uri';
          type: 'string';
        }
      ];
    },
    {
      name: 'newTree';
      accounts: [
        {
          name: 'node';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'mint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'mintTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'nodeBump';
          type: 'u8';
        }
      ];
    },
    {
      name: 'treeNodeAdd';
      accounts: [
        {
          name: 'node';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'parentMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'mint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'mintTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'nodeBump';
          type: 'u8';
        }
      ];
    },
    {
      name: 'treeNodeExtract';
      accounts: [
        {
          name: 'node';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'mint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'mintTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'nodeBump';
          type: 'u8';
        }
      ];
    },
    {
      name: 'treeNodeTransfer';
      accounts: [
        {
          name: 'node';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'mint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'mintTokenAccount';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'receiver';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'nodeBump';
          type: 'u8';
        }
      ];
    },
    {
      name: 'destroyTree';
      accounts: [
        {
          name: 'node';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'mint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'mintTokenAccount';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'receiver';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'nodeBump';
          type: 'u8';
        }
      ];
    }
  ];
  accounts: [
    {
      name: 'treeNode';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'parentMint';
            type: {
              option: 'publicKey';
            };
          },
          {
            name: 'childrenMint';
            type: 'publicKey';
          },
          {
            name: 'owner';
            type: 'publicKey';
          }
        ];
      };
    }
  ];
};

export const IDL: Sol998 = {
  version: '0.1.0',
  name: 'sol998',
  instructions: [
    {
      name: 'initialize',
      accounts: [],
      args: []
    },
    {
      name: 'mintHeroPre',
      accounts: [
        {
          name: 'heroMint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'name',
          type: 'string'
        },
        {
          name: 'symbol',
          type: 'string'
        },
        {
          name: 'uri',
          type: 'string'
        }
      ]
    },
    {
      name: 'mintHero',
      accounts: [
        {
          name: 'heroMint',
          isMut: true,
          isSigner: false
        },
        {
          name: 'heroMintTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'heroMetadataAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'mplProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'name',
          type: 'string'
        },
        {
          name: 'symbol',
          type: 'string'
        },
        {
          name: 'uri',
          type: 'string'
        }
      ]
    },
    {
      name: 'newTree',
      accounts: [
        {
          name: 'node',
          isMut: true,
          isSigner: false
        },
        {
          name: 'mint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'mintTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'nodeBump',
          type: 'u8'
        }
      ]
    },
    {
      name: 'treeNodeAdd',
      accounts: [
        {
          name: 'node',
          isMut: true,
          isSigner: false
        },
        {
          name: 'parentMint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'mint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'mintTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'nodeBump',
          type: 'u8'
        }
      ]
    },
    {
      name: 'treeNodeExtract',
      accounts: [
        {
          name: 'node',
          isMut: true,
          isSigner: false
        },
        {
          name: 'mint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'mintTokenAccount',
          isMut: true,
          isSigner: false
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'nodeBump',
          type: 'u8'
        }
      ]
    },
    {
      name: 'treeNodeTransfer',
      accounts: [
        {
          name: 'node',
          isMut: true,
          isSigner: false
        },
        {
          name: 'mint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'mintTokenAccount',
          isMut: false,
          isSigner: false
        },
        {
          name: 'receiver',
          isMut: false,
          isSigner: false
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'nodeBump',
          type: 'u8'
        }
      ]
    },
    {
      name: 'destroyTree',
      accounts: [
        {
          name: 'node',
          isMut: true,
          isSigner: false
        },
        {
          name: 'mint',
          isMut: false,
          isSigner: false
        },
        {
          name: 'mintTokenAccount',
          isMut: false,
          isSigner: false
        },
        {
          name: 'receiver',
          isMut: false,
          isSigner: false
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'nodeBump',
          type: 'u8'
        }
      ]
    }
  ],
  accounts: [
    {
      name: 'treeNode',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8'
          },
          {
            name: 'parentMint',
            type: {
              option: 'publicKey'
            }
          },
          {
            name: 'childrenMint',
            type: 'publicKey'
          },
          {
            name: 'owner',
            type: 'publicKey'
          }
        ]
      }
    }
  ]
};
