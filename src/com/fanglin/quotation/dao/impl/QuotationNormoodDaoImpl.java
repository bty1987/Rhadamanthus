/**
 * @File Name		: CustomQuotationItemDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.apache.poi.ss.formula.functions.T;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.NormoodPO;
import com.fanglin.quotation.dao.QuotationNormoodDao;
import com.fanglin.quotation.po.AddReduceItemPO;
import com.fanglin.quotation.po.ExtensionItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemAO;

@Repository("quotationNormoodDao")
public class QuotationNormoodDaoImpl extends DaoImpl<QuotationFunctionAreaItemAO> implements QuotationNormoodDao {

	public QuotationNormoodDaoImpl() {
		super(QuotationFunctionAreaItemAO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<T> queryQuotationFunctionAreaItem(short index, long functionAreaId) {

		String sql = String.format("select {quoteitem.*}, {mood.*}, {good.*} from quotation.quotationfunctionareaitem%d quoteitem, data.normood mood, inventory.goods good where quoteitem.quotationFunctionAreaId = :functionAreaId and quoteitem.quotationItemId = mood.qiid and mood.gid = good.gid", index);

		return session().createSQLQuery(sql).addEntity("quoteitem", QuotationFunctionAreaItemAO.class).addEntity("mood", NormoodPO.class).addEntity("good", GoodsPO.class).setLong("functionAreaId", functionAreaId).list();
	}

	@Override
	public List<?> queryAddReduceItem(long arid) {

		String sql = "select {aritem.*}, {mood.*}, {good.*} from quotation.addreduceitem aritem, data.normood mood, inventory.goods good where aritem.arid = :arid and aritem.qiid = mood.qiid and mood.gid = good.gid";

		return session().createSQLQuery(sql).addEntity("aritem", AddReduceItemPO.class).addEntity("mood", NormoodPO.class).addEntity("good", GoodsPO.class).setLong("arid", arid).list();
	}

	@Override
	public List<?> queryExtensionItem(long eid) {

		String sql = "select {exitem.*}, {mood.*}, {good.*} from quotation.extensionitem exitem, data.normood mood, inventory.goods good where exitem.eid = :eid and exitem.qiid = mood.qiid and mood.gid = good.gid";

		return session().createSQLQuery(sql).addEntity("exitem", ExtensionItemPO.class).addEntity("mood", NormoodPO.class).addEntity("good", GoodsPO.class).setLong("eid", eid).list();
	}

	@Override
	public List<?> amountQuotationNormood(short index, long functionAreaId) {

		String sql = String.format("select {mood.*}, {good.*}, sum(mood.normnum) as normnum, sum(mood.storenum) as storenum, quoteitem.initnum as initnum from quotation.quotationfunctionareaitem%d quoteitem, data.normood mood, inventory.goods good where quoteitem.quotationFunctionAreaId = :functionAreaId and quoteitem.quotationItemId = mood.qiid and mood.gid = good.gid group by good.gid", index);

		return session().createSQLQuery(sql).addEntity("mood", NormoodPO.class).addEntity("good", GoodsPO.class).addScalar("normnum", StandardBasicTypes.INTEGER).addScalar("storenum", StandardBasicTypes.INTEGER).addScalar("initnum", StandardBasicTypes.INTEGER).setLong("functionAreaId", functionAreaId).list();
	}

	@Override
	public List<?> amountExtensionNormood(long eid) {

		String sql = "select {mood.*}, {good.*}, sum(mood.normnum) as normnum, sum(mood.storenum) as storenum, ei.num as num from quotation.extensionitem ei, data.normood mood, inventory.goods good where ei.eid = :eid and ei.qiid = mood.qiid and mood.gid = good.gid group by good.gid";

		return session().createSQLQuery(sql).addEntity("mood", NormoodPO.class).addEntity("good", GoodsPO.class).addScalar("normnum", StandardBasicTypes.INTEGER).addScalar("storenum", StandardBasicTypes.INTEGER).addScalar("num", StandardBasicTypes.INTEGER).setLong("eid", eid).list();
	}

	@Override
	public List<?> amountAddReduceNormood(long arid) {

		String sql = "select {mood.*}, {good.*}, sum(mood.normnum) as normnum, sum(mood.storenum) as storenum, ari.num as num from quotation.addreduceitem ari, data.normood mood, inventory.goods good where ari.arid = :arid and ari.qiid = mood.qiid and mood.gid = good.gid group by good.gid";

		return session().createSQLQuery(sql).addEntity("mood", NormoodPO.class).addEntity("good", GoodsPO.class).addScalar("normnum", StandardBasicTypes.INTEGER).addScalar("storenum", StandardBasicTypes.INTEGER).addScalar("num", StandardBasicTypes.INTEGER).setLong("arid", arid).list();
	}

}
