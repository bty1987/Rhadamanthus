package com.fanglin.quotation.po;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 定额材料明细原表实体(normooditem, 分表路由 index=0)。
 *
 * 结构与 NormoodItemPO1 并列(各自独立根实体 extends {@link NormoodItemPO} 基类)。
 */
@Entity
@Table(name = "normooditem", catalog = "quotation")
public class NormoodItemPO0 extends NormoodItemPO {

	private static final long serialVersionUID = 1L;

}
