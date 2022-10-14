package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.ReceiptTypeItemDao;
import com.fanglin.data.po.ReceiptTypeItemPO;

@Repository("receiptTypeItemDao")
public class ReceiptTypeItemDaoImpl extends DaoImpl<ReceiptTypeItemPO> implements ReceiptTypeItemDao {

	public ReceiptTypeItemDaoImpl() {
		super(ReceiptTypeItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ReceiptTypeItemPO> queryReceiptTypeItem(Long rtid) {
		return session().createCriteria(ReceiptTypeItemPO.class).add(Restrictions.eq(ReceiptTypeItemPO.COLUMN_RTID_STR, rtid)).list();
	}

	@Override
	public ReceiptTypeItemPO queryReceiptTypeItemByBustype(Long rtid, Short type, Short paytype) {

		Criteria criteria = session().createCriteria(ReceiptTypeItemPO.class).add(Restrictions.eq(ReceiptTypeItemPO.COLUMN_RTID_STR, rtid));

		if (type != null) {
			criteria.add(Restrictions.eq(ReceiptTypeItemPO.COLUMN_TYPE_STR, type));
		}

		if (paytype != null) {
			criteria.add(Restrictions.eq(ReceiptTypeItemPO.COLUMN_PAYTYPE_STR, paytype));
		}

		return (ReceiptTypeItemPO) criteria.uniqueResult();
	}

}
