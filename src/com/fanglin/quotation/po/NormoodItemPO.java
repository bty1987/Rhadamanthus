package com.fanglin.quotation.po;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 定额材料明细原表实体(normooditem, 分表路由 index=0)。
 *
 * 字段映射见 {@link NormoodItemBase}(@MappedSuperclass);
 * 分表 normooditem{index} 实体为 {@link NormoodItemPO1} 等, 同 extends Base 结构。
 * 🔴 分表实体与原表实体是并列根实体, 禁止相互/向本类 extends —— 见 NormriceItemPO 类注释说明。
 */
@Entity
@Table(name = "normooditem", catalog = "quotation")
public class NormoodItemPO extends NormoodItemBase {

	private static final long serialVersionUID = -7353897102057094950L;

	// 定额明细分表路由(normtion.index 决定): 0=原表, >0=normooditem{index} 分表
	public static String tableName(int index) {
		return index == 0 ? "normooditem" : "normooditem" + index;
	}

	public static Class<? extends NormoodItemBase> factoryToClazz(int index) {
		if (index == 0) {
			return NormoodItemPO.class;
		}
		try {
			return (Class<? extends NormoodItemBase>) Class.forName("com.fanglin.quotation.po.NormoodItemPO" + index);
		} catch (Exception e) {
			throw new RuntimeException("定额明细分表实体不存在: normooditem" + index, e);
		}
	}

	public static NormoodItemBase factoryToInstance(int index) {
		if (index == 0) {
			return new NormoodItemPO();
		}
		try {
			return (NormoodItemBase) Class.forName("com.fanglin.quotation.po.NormoodItemPO" + index).newInstance();
		} catch (Exception e) {
			throw new RuntimeException("定额明细分表实体不存在: normooditem" + index, e);
		}
	}

}
