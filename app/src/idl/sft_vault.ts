export type SftVault = {
    "version": "0.1.0",
    "name": "sft",
    "instructions": [
        {
            "name": "initVault",
            "accounts": [
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "params",
                    "type": {
                        "defined": "InitVaultParams"
                    }
                }
            ]
        },
        {
            "name": "createMetadata",
            "accounts": [
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "mint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "metadata",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenMetadataProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "params",
                    "type": {
                        "defined": "CreateMetadataParams"
                    }
                }
            ]
        },
        {
            "name": "mintSft",
            "accounts": [
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "fragmentMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "fragmentAta",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nativeMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "payerSolAta",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "vaultSolAta",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "params",
                    "type": {
                        "defined": "MintSftParams"
                    }
                }
            ]
        },
        {
            "name": "combine",
            "accounts": [
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "fragmentMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "pieceMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "payerFragmentAta",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "vaultFragmentAta",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "pieceAta",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "params",
                    "type": {
                        "defined": "CombineParams"
                    }
                }
            ]
        },
        {
            "name": "withdraw",
            "accounts": [
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nativeMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "authoritySolAta",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "vaultSolAta",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "params",
                    "type": {
                        "defined": "WithdrawParams"
                    }
                }
            ]
        },
        {
            "name": "closePda",
            "accounts": [
                {
                    "name": "signer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "pda",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        }
    ],
    "accounts": [
        {
            "name": "vault",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "bump",
                        "type": "u8"
                    },
                    {
                        "name": "authority",
                        "type": "publicKey"
                    },
                    {
                        "name": "pieceSfts",
                        "type": {
                            "array": [
                                {
                                    "defined": "Sft"
                                },
                                3
                            ]
                        }
                    },
                    {
                        "name": "fragmentSfts",
                        "type": {
                            "array": [
                                {
                                    "defined": "Sft"
                                },
                                3
                            ]
                        }
                    },
                    {
                        "name": "pricePerSft",
                        "type": "u64"
                    },
                    {
                        "name": "solBalance",
                        "type": "u64"
                    }
                ]
            }
        }
    ],
    "types": [
        {
            "name": "CombineParams",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "amount",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "CreateMetadataParams",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "name": "symbol",
                        "type": "string"
                    },
                    {
                        "name": "uri",
                        "type": "string"
                    }
                ]
            }
        },
        {
            "name": "InitVaultParams",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "pieceMints",
                        "type": {
                            "array": [
                                "publicKey",
                                3
                            ]
                        }
                    },
                    {
                        "name": "fragmentMints",
                        "type": {
                            "array": [
                                "publicKey",
                                3
                            ]
                        }
                    },
                    {
                        "name": "pricePerSft",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "MintSftParams",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "amount",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "WithdrawParams",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "amount",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "Sft",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "mint",
                        "type": "publicKey"
                    },
                    {
                        "name": "mintedAmount",
                        "type": "u64"
                    },
                    {
                        "name": "totalSupply",
                        "type": "u64"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "MintNotFound",
            "msg": "Mint Not Found"
        },
        {
            "code": 6001,
            "name": "ExceedsMaxMintableAmount",
            "msg": "Exceeds Max Mintable Amount"
        }
    ]
};

export const IDL: SftVault = {
    "version": "0.1.0",
    "name": "sft",
    "instructions": [
        {
            "name": "initVault",
            "accounts": [
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "params",
                    "type": {
                        "defined": "InitVaultParams"
                    }
                }
            ]
        },
        {
            "name": "createMetadata",
            "accounts": [
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "mint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "metadata",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenMetadataProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "params",
                    "type": {
                        "defined": "CreateMetadataParams"
                    }
                }
            ]
        },
        {
            "name": "mintSft",
            "accounts": [
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "fragmentMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "fragmentAta",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nativeMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "payerSolAta",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "vaultSolAta",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "params",
                    "type": {
                        "defined": "MintSftParams"
                    }
                }
            ]
        },
        {
            "name": "combine",
            "accounts": [
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "fragmentMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "pieceMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "payerFragmentAta",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "vaultFragmentAta",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "pieceAta",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "params",
                    "type": {
                        "defined": "CombineParams"
                    }
                }
            ]
        },
        {
            "name": "withdraw",
            "accounts": [
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nativeMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "authoritySolAta",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "vaultSolAta",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "params",
                    "type": {
                        "defined": "WithdrawParams"
                    }
                }
            ]
        },
        {
            "name": "closePda",
            "accounts": [
                {
                    "name": "signer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "pda",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        }
    ],
    "accounts": [
        {
            "name": "vault",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "bump",
                        "type": "u8"
                    },
                    {
                        "name": "authority",
                        "type": "publicKey"
                    },
                    {
                        "name": "pieceSfts",
                        "type": {
                            "array": [
                                {
                                    "defined": "Sft"
                                },
                                3
                            ]
                        }
                    },
                    {
                        "name": "fragmentSfts",
                        "type": {
                            "array": [
                                {
                                    "defined": "Sft"
                                },
                                3
                            ]
                        }
                    },
                    {
                        "name": "pricePerSft",
                        "type": "u64"
                    },
                    {
                        "name": "solBalance",
                        "type": "u64"
                    }
                ]
            }
        }
    ],
    "types": [
        {
            "name": "CombineParams",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "amount",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "CreateMetadataParams",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "name": "symbol",
                        "type": "string"
                    },
                    {
                        "name": "uri",
                        "type": "string"
                    }
                ]
            }
        },
        {
            "name": "InitVaultParams",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "pieceMints",
                        "type": {
                            "array": [
                                "publicKey",
                                3
                            ]
                        }
                    },
                    {
                        "name": "fragmentMints",
                        "type": {
                            "array": [
                                "publicKey",
                                3
                            ]
                        }
                    },
                    {
                        "name": "pricePerSft",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "MintSftParams",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "amount",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "WithdrawParams",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "amount",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "Sft",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "mint",
                        "type": "publicKey"
                    },
                    {
                        "name": "mintedAmount",
                        "type": "u64"
                    },
                    {
                        "name": "totalSupply",
                        "type": "u64"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "MintNotFound",
            "msg": "Mint Not Found"
        },
        {
            "code": 6001,
            "name": "ExceedsMaxMintableAmount",
            "msg": "Exceeds Max Mintable Amount"
        }
    ]
};