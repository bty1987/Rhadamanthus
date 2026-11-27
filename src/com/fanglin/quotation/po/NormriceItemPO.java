package com.fanglin.quotation.po;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 定额工费明细原表实体(normriceitem, 分表路由 index=0)。
 *
 * 字段映射见 {@link NormriceItemBase}(@MappedSuperclass);
 * 分表 normriceitem{index} 实体为 {@link NormriceItemPO1} 等, 同 extends Base 结构。
 * 🔴 分表实体与原表实体是并列根实体, 禁止相互/向本类 extends —— 子实体继承 @Entity 父类
 * 会被 Hibernate 建为 SingleTableSubclass, 启动即 ClassCastException(sessionFactory 无法初始化)。
 */
@Entity
@Table(name = "normriceitem", catalog = "quotation")
public class NormriceItemPO extends NormriceItemBase {

	private static final long serialVersionUID = 6717294534034384261L;

	// 定额明细分表路由(normtion.index 决定): 0=原表, >0=normriceitem{index} 分表
	public static String tableName(int index) {
		return index == 0 ? "normriceitem" : "normriceitem" + index;
	}

	public static Class<? extends NormriceItemBase> factoryToClazz(int index) {
		if (index == 0) {
			return NormriceItemPO.class;
		}
		try {
			return (Class<? extends NormriceItemBase>) Class.forName("com.fanglin.quotation.po.NormriceItemPO" + index);
		} catch (Exception e) {
			throw new RuntimeException("定额明细分表实体不存在: normriceitem" + index, e);
		}
	}

	public static NormriceItemBase factoryToInstance(int index) {
		if (index == 0) {
			return new NormriceItemPO();
		}
		try {
			return (NormriceItemBase) Class.forName("com.fanglin.quotation.po.NormriceItemPO" + index).newInstance();
		} catch (Exception e) {
			throw new RuntimeException("定额明细分表实体不存在: normriceitem" + index, e);
		}
	}

}
