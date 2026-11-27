package com.fanglin.quotation.po;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 定额工费明细分表实体(normriceitem1, 分表路由 index=1)。
 *
 * 结构与 {@link NormriceItemPO} 并列(各自独立根实体 extends {@link NormriceItemBase}),
 * 🔴 禁止 extends NormriceItemPO —— 见 NormriceItemPO 类注释的 SingleTableSubclass 启动炸说明。
 */
@Entity
@Table(name = "normriceitem1", catalog = "quotation")
public class NormriceItemPO1 extends NormriceItemBase {

	private static final long serialVersionUID = 1L;

}
