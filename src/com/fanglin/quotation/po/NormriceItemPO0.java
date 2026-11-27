package com.fanglin.quotation.po;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 定额工费明细原表实体(normriceitem, 分表路由 index=0)。
 *
 * 结构与 NormriceItemPO1 并列(各自独立根实体 extends {@link NormriceItemPO} 基类)。
 */
@Entity
@Table(name = "normriceitem", catalog = "quotation")
public class NormriceItemPO0 extends NormriceItemPO {

	private static final long serialVersionUID = 1L;

}
