package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QeasureItemDao;
import com.fanglin.quotation.po.QeasureItemPO;

@Repository("qeasureItemDao")
public class QeasureItemDaoImpl extends DaoImpl<QeasureItemPO> implements QeasureItemDao {

	public QeasureItemDaoImpl() {
		super(QeasureItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QeasureItemPO> queryQeasureItem(long qmid) {
		return session().createCriteria(QeasureItemPO.class).add(Restrictions.eq("qmid", qmid)).add(Restrictions.eq("atttype", QeasureItemPO.ATTTYPE_QEASURE_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QeasureItemPO> queryQeasureItem(long qmfaid, short atttype) {
		return session().createCriteria(QeasureItemPO.class).add(Restrictions.eq("qmfaid", qmfaid)).add(Restrictions.eq("atttype", atttype)).list();
	}

	@Override
	public int deleteQeasureItem(long qmfaid, short type) {

		String sql = "delete from quotetion.qeasureitem where qmfaid = :qmfaid and type = :type";
		session().createSQLQuery(sql).setLong("qmfaid", qmfaid).setShort("type", type).executeUpdate();

		return 0;
	}

}
