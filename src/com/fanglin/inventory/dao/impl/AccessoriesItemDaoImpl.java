package com.fanglin.inventory.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.inventory.dao.AccessoriesItemDao;
import com.fanglin.inventory.po.AccessoriesItemPO;
import com.fanglin.utils.Arith;

@Repository("accessoriesItemDao")
public class AccessoriesItemDaoImpl extends DaoImpl<AccessoriesItemPO> implements AccessoriesItemDao {

	public AccessoriesItemDaoImpl() {
		super(AccessoriesItemPO.class);
	}

	@Override
	public List<?> queryAccessoriesItem(String orderId) {

		String hql = "select distinct acsitem from AccessoriesItemPO acsitem left join fetch acsitem.goods left join fetch acsitem.colors left join fetch acsitem.formats, AccessoriesPO acs where acs.orderId = :orderId and acs.aid = acsitem.aid";

		return session().createQuery(hql).setString("orderId", orderId).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AccessoriesItemPO> queryAccessoriesItem(long aid) {
		String hql = "select distinct acsitem from AccessoriesItemPO acsitem left join fetch acsitem.goods left join fetch acsitem.colors left join fetch acsitem.formats where acsitem.aid = :aid";
		Query query = session().createQuery(hql).setLong("aid", aid);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AccessoriesItemPO> queryAccessoriesItem(List<Long> aids) {
		String hql = "select distinct acsitem from AccessoriesItemPO acsitem left join fetch acsitem.goods left join fetch acsitem.colors left join fetch acsitem.formats where acsitem.aid in (:aids)";
		Query query = session().createQuery(hql).setParameterList("aids", aids);

		return query.list();
	}

	@Override
	public int amountAccessoriesItem(String orderId, long nid) {

		String sql = "select CAST(sum(if(type = 0, ai.num, -ai.num)*ai.storenum) AS SIGNED) from inventory.accessories a, inventory.accessoriesitem ai where a.orderId = :orderId and a.aid = ai.aid and nid =:nid and a.status not in (3, 4)";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).setLong("nid", nid).uniqueResult();

		return count == null ? 0 : Arith.div(count.intValue(), 1000000);
	}

}
