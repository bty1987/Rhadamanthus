/**
 * @File Name		: QuotationNormtimeDaoImpl.java
 * @Package   	: com.fanglin.quotation.dao.impl
 * @Version		: 1.0
 * @Date			: 2025-12-01
 * @Copyright	: Copyright Creators 2014
 * @Author		: AI Assistant
 * @Email			:
 * @Describing	: 定额工时查询 DAO 实现
 */

package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.NormtimePO;
import com.fanglin.quotation.dao.QuotationNormtimeDao;
import com.fanglin.quotation.po.AddReduceItemPO;
import com.fanglin.quotation.po.ExtensionItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemMO;

@Repository("quotationNormtimeDao")
public class QuotationNormtimeDaoImpl extends DaoImpl<QuotationFunctionAreaItemMO> implements QuotationNormtimeDao {

	public QuotationNormtimeDaoImpl() {
		super(QuotationFunctionAreaItemMO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<?> queryQuotationFunctionAreaItem(short index, long functionAreaId, Short schedule) {

		String sql = String.format("select i.*, m.*, n.* from quotation.quotationfunctionareaitem%d i, data.normtime m, data.constructionnode n where i.quotationFunctionAreaId = :functionAreaId and i.quotationItemId = m.qiid and m.cnid = n.cnid", index);

		if (schedule != null) {
			sql = String.format("%s and n.sort = :schedule", sql);
		}

		SQLQuery query = session().createSQLQuery(sql).addEntity(QuotationFunctionAreaItemMO.class).addEntity(NormtimePO.class).addEntity(ConstructionNodePO.class);

		query.setLong("functionAreaId", functionAreaId);

		if (schedule != null) {
			query.setShort("schedule", schedule);
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<?> queryExtensionItem(long eid, Short schedule) {

		String sql = "select i.*, m.*, n.* from quotation.extensionitem i, data.normtime m, data.constructionnode n where i.eid = :eid and i.qiid = m.qiid and m.cnid = n.cnid";

		if (schedule != null) {
			sql = String.format("%s and n.sort = :schedule", sql);
		}

		SQLQuery query = session().createSQLQuery(sql).addEntity(ExtensionItemPO.class).addEntity(NormtimePO.class).addEntity(ConstructionNodePO.class);

		query.setLong("eid", eid);

		if (schedule != null) {
			query.setShort("schedule", schedule);
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<?> queryAddReduceItem(long arid, Short schedule) {

		String sql = "select i.*, m.*, n.* from quotation.addreduceitem i, data.normtime m, data.constructionnode n where i.arid = :arid and i.qiid = m.qiid and m.cnid = n.cnid";

		if (schedule != null) {
			sql = String.format("%s and n.sort = :schedule", sql);
		}

		SQLQuery query = session().createSQLQuery(sql).addEntity(AddReduceItemPO.class).addEntity(NormtimePO.class).addEntity(ConstructionNodePO.class);

		query.setLong("arid", arid);

		if (schedule != null) {
			query.setShort("schedule", schedule);
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<?> amountQuotationNormtime(short index, long functionAreaId) {

		String sql = String.format("select m.*, n.*, m.workdays as totalDays, 0 as stuff, i.num as num from quotation.quotationfunctionareaitem%d i, data.normtime m, data.constructionnode n where i.quotationFunctionAreaId = :functionAreaId and i.quotationItemId = m.qiid and m.cnid = n.cnid", index);

		return session().createSQLQuery(sql).addEntity(NormtimePO.class).addEntity(ConstructionNodePO.class).addScalar("totalDays", StandardBasicTypes.DOUBLE).addScalar("stuff", StandardBasicTypes.INTEGER).addScalar("num", StandardBasicTypes.INTEGER).setLong("functionAreaId", functionAreaId).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<?> amountExtensionNormtime(long eid) {

		String sql = "select m.*, n.*, if(i.type in (0, 1, 5), m.workdays, -m.workdays) as totalDays, if(i.type in (0, 1, 5), 0, 0) as stuff, if(i.type in (0, 1, 5), i.num, -i.num) as num from quotation.extensionitem i, data.normtime m, data.constructionnode n where i.eid = :eid and i.qiid = m.qiid and m.cnid = n.cnid";

		return session().createSQLQuery(sql).addEntity(NormtimePO.class).addEntity(ConstructionNodePO.class).addScalar("totalDays", StandardBasicTypes.DOUBLE).addScalar("stuff", StandardBasicTypes.INTEGER).addScalar("num", StandardBasicTypes.INTEGER).setLong("eid", eid).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<?> amountAddReduceNormtime(long arid) {

		String sql = "select m.*, n.*, if(i.type in (0, 1, 2), m.workdays, -m.workdays) as totalDays, if(i.type in (0, 1, 2), 0, 0) as stuff, if(i.type in (0, 1, 2), i.num, -i.num) as num from quotation.addreduceitem i, data.normtime m, data.constructionnode n where i.arid = :arid and i.qiid = m.qiid and m.cnid = n.cnid";

		return session().createSQLQuery(sql).addEntity(NormtimePO.class).addEntity(ConstructionNodePO.class).addScalar("totalDays", StandardBasicTypes.DOUBLE).addScalar("stuff", StandardBasicTypes.INTEGER).addScalar("num", StandardBasicTypes.INTEGER).setLong("arid", arid).list();
	}
}
