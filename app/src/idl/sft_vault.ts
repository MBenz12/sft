export type SftVault = {
    "version": "0.1.0",
    "name": "sft",
    "instructions": [
        {
            "name": "initialize",
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
            "name": "initialize",
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