package com.fanglin.quotation.po;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 定额材料明细分表实体(normooditem1, 分表路由 index=1)。
 *
 * 结构与 {@link NormoodItemPO} 并列(各自独立根实体 extends {@link NormoodItemPO}),
 * 🔴 禁止 extends NormoodItemPO —— 见 NormriceItemPO 类注释的 SingleTableSubclass 启动炸说明。
 */
@Entity
@Table(name = "normooditem1", catalog = "quotation")
public class NormoodItemPO1 extends NormoodItemPO {

	private static final long serialVersionUID = 1L;

}
