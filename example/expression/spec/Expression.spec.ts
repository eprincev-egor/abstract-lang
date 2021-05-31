import { ExpressionLang } from "../ExpressionLang";
import { Expression } from "../Expression";

describe("Expression", () => {

    it("valid inputs", () => {
        ExpressionLang.assertNode(Expression, {
            input: "1",
            shouldBe: {
                json: {
                    operand: {number: "1"}
                }
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "-1",
            shouldBe: {
                json: {
                    operand: {
                        preOperator: "-",
                        operand: {number: "1"}
                    }
                }
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "+1.099",
            shouldBe: {
                json: {
                    operand: {
                        preOperator: "+",
                        operand: {number: "1.099"}
                    }
                }
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "hello",
            shouldBe: {
                json: {
                    operand: {name: "hello"}
                }
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "2 +1",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "2"},
                        operator: "+",
                        right: {number: "1"}
                    }
                },
                pretty: "2 + 1",
                minify: "2+1"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "hello * 2",
            shouldBe: {
                json: {
                    operand: {
                        left: {name: "hello"},
                        operator: "*",
                        right: {number: "2"}
                    }
                },
                minify: "hello*2"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "i++",
            shouldBe: {
                json: {
                    operand: {
                        operand: {name: "i"},
                        postOperator: "++"
                    }
                }
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "j--",
            shouldBe: {
                json: {
                    operand: {
                        operand: {name: "j"},
                        postOperator: "--"
                    }
                }
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "10-3",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "10"},
                        operator: "-",
                        right: {number: "3"}
                    }
                },
                pretty: "10 - 3"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "true || false",
            shouldBe: {
                json: {
                    operand: {
                        left: {boolean: true},
                        operator: "||",
                        right: {boolean: false}
                    }
                },
                minify: "true||false"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "!false && +true",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            preOperator: "!",
                            operand: {boolean: false}
                        },
                        operator: "&&",
                        right: {
                            preOperator: "+",
                            operand: {boolean: true}
                        }
                    }
                },
                minify: "!false&&+true"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "null > 0",
            shouldBe: {
                json: {
                    operand: {
                        left: {null: true},
                        operator: ">",
                        right: {number: "0"}
                    }
                },
                minify: "null>0"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "-1+ 2",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            preOperator: "-",
                            operand: {number: "1"}
                        },
                        operator: "+",
                        right: {number: "2"}
                    }
                },
                pretty: "-1 + 2",
                minify: "-1+2"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "+-1+ 2",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            preOperator: "+",
                            operand: {
                                preOperator: "-",
                                operand: {number: "1"}
                            }
                        },
                        operator: "+",
                        right: {number: "2"}
                    }
                },
                pretty: "+-1 + 2",
                minify: "+-1+2"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "gid++ - 99",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            postOperator: "++",
                            operand: {name: "gid"}
                        },
                        operator: "-",
                        right: {number: "99"}
                    }
                },
                minify: "gid++-99"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "1+ 2 +3",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            left: {number: "1"},
                            operator: "+",
                            right: {number: "2"}
                        },
                        operator: "+",
                        right: {number: "3"}
                    }
                },
                pretty: "1 + 2 + 3",
                minify: "1+2+3"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "gid++ * gid--",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            postOperator: "++",
                            operand: {name: "gid"}
                        },
                        operator: "*",
                        right: {
                            postOperator: "--",
                            operand: {name: "gid"}
                        }
                    }
                },
                minify: "gid++*gid--"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "--x % ++y",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            preOperator: "--",
                            operand: {name: "x"}
                        },
                        operator: "%",
                        right: {
                            preOperator: "++",
                            operand: {name: "y"}
                        }
                    }
                },
                minify: "--x%++y"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "obj.prop",
            shouldBe: {
                json: {
                    operand: {
                        operand: {name: "obj"},
                        property: {name: "prop"}
                    }
                }
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "obj . prop",
            shouldBe: {
                json: {
                    operand: {
                        operand: {name: "obj"},
                        property: {name: "prop"}
                    }
                },
                pretty: "obj.prop",
                minify: "obj.prop"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "'hello' + \"world\"",
            shouldBe: {
                json: {
                    operand: {
                        left: {string: "hello"},
                        operator: "+",
                        right: {string: "world"}
                    }
                },
                pretty: "'hello' + 'world'",
                minify: "'hello'+'world'"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "'hello\\''",
            shouldBe: {
                json: {
                    operand: {
                        string: "hello'"
                    }
                }
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "'\\\\hello'",
            shouldBe: {
                json: {
                    operand: {
                        string: "\\hello"
                    }
                }
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "'\\nhello'",
            shouldBe: {
                json: {
                    operand: {
                        string: "\nhello"
                    }
                }
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "'\\rhello'",
            shouldBe: {
                json: {
                    operand: {
                        string: "\rhello"
                    }
                }
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "2 + 2 * 2",
            shouldBe: {
                json: {
                    operand: {
                        left: {number: "2"},
                        operator: "+",
                        right: {
                            left: {number: "2"},
                            operator: "*",
                            right: {number: "2"}
                        }
                    }
                },
                minify: "2+2*2"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "2 * 2 + 2",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            left: {number: "2"},
                            operator: "*",
                            right: {number: "2"}
                        },
                        operator: "+",
                        right: {number: "2"}
                    }
                },
                minify: "2*2+2"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "(2 + 2) * 2",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            operandInBrackets: {
                                left: {number: "2"},
                                operator: "+",
                                right: {number: "2"}
                            }
                        },
                        operator: "*",
                        right: {number: "2"}
                    }
                },
                minify: "(2+2)*2"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "1 + 2 * 3 - 4",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            left: {number: "1"},
                            operator: "+",
                            right: {
                                left: {number: "2"},
                                operator: "*",
                                right: {number: "3"}
                            }
                        },
                        operator: "-",
                        right: {number: "4"}
                    }
                },
                minify: "1+2*3-4"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "-1 * 2 + 3 * 4 - 5 - 6 * 7",
            shouldBe: {
                json: {
                    operand: {
                        left: {
                            left: {
                                left: {
                                    left: {
                                        preOperator: "-",
                                        operand: {number: "1"}
                                    },
                                    operator: "*",
                                    right: {number: "2"}
                                },
                                operator: "+",
                                right: {
                                    left: {number: "3"},
                                    operator: "*",
                                    right: {number: "4"}
                                }
                            },
                            operator: "-",
                            right: {number: "5"}
                        },
                        operator: "-",
                        right: {
                            left: {number: "6"},
                            operator: "*",
                            right: {number: "7"}
                        }
                    }
                },
                minify: "-1*2+3*4-5-6*7"
            }
        });

        ExpressionLang.assertNode(Expression, {
            input: "a.b.c.d",
            shouldBe: {
                json: {
                    operand: {
                        operand: {
                            operand: {
                                operand: {name: "a"},
                                property: {name: "b"}
                            },
                            property: {name: "c"}
                        },
                        property: {name: "d"}
                    }
                }
            }
        });

    });

});