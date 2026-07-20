package com.fanglin.building.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.building.dao.BuildingCustomerDao;
import com.fanglin.building.po.BuildingCustomerPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("buildingCustomerDao")
public class BuildingCustomerDaoImpl extends DaoImpl<BuildingCustomerPO> implements BuildingCustomerDao {

	public BuildingCustomerDaoImpl() {
		super(BuildingCustomerPO.class);
	}

	@Override
	public List<BuildingCustomerPO> pageBuildingCustomer(Paging paging, List<Filter> filters, Integer uid) {

		PagingQuery<BuildingCustomerPO> query = pagingQuery(paging, BuildingCustomerPO.class);

		query.add(query.getCriterion("create.uid", uid, "eq"));

		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if ("custumerName".equals(field)) {
					query.alias("customer", "customer");
					query.add(query.getCriterion("customer.cid", Long.valueOf(data), op));
				} else if ("no".equals(field)) {
					query.add(query.getCriterion("no", data, op));
				}
			}
		}
		return query.list();
	}

	@Override
	public BuildingCustomerPO queryBuildingCustomerByNo(String no) {
		return (BuildingCustomerPO) session().createCriteria(BuildingCustomerPO.class).add(Restrictions.eq(BuildingCustomerPO.COLUMN_NO_STR, no)).setMaxResults(1).uniqueResult();
	}

	@Override
	public BuildingCustomerPO checkBuildingCustomer(Long cid, Short type) {
		return (BuildingCustomerPO) session().createCriteria(BuildingCustomerPO.class).add(Restrictions.eq(BuildingCustomerPO.COLUMN_CID_STR, cid)).add(Restrictions.eq(BuildingCustomerPO.COLUMN_TYPE_STR, type)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int countBuildingCustomer(Long cid, Short type) {

		String sql = "select count(*) from building.buildingCustomer where cid = :cid and type = :type";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("cid", cid).setShort("type", type).uniqueResult();

		return count.intValue();
	}

}
