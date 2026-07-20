package com.fanglin.building.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.building.dao.BuildingHouseDao;
import com.fanglin.building.po.BuildingHousePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("buildingHouseDao")
public class BuildingHouseDaoImpl extends DaoImpl<BuildingHousePO> implements BuildingHouseDao {

	public BuildingHouseDaoImpl() {
		super(BuildingHousePO.class);
	}

	@Override
	public List<BuildingHousePO> pageBuildingHouse(Paging paging, List<Filter> filters, List<Integer> dids) {

		PagingQuery<BuildingHousePO> query = pagingQuery(paging, BuildingHousePO.class);

		if (dids != null && dids.size() > 0) {
			query.alias("department", "department").add(query.getCriterion("department.did", dids, "in"));
		}

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public BuildingHousePO queryBuildingHouseByNo(String no) {
		return (BuildingHousePO) session().createCriteria(BuildingHousePO.class).add(Restrictions.eq(BuildingHousePO.COLUMN_NO_STR, no)).setMaxResults(1).uniqueResult();
	}

	@Override
	public BuildingHousePO checkBuildingHouse(Long hid, Short type) {
		return (BuildingHousePO) session().createCriteria(BuildingHousePO.class).add(Restrictions.eq(BuildingHousePO.COLUMN_HID_STR, hid)).add(Restrictions.eq(BuildingHousePO.COLUMN_TYPE_STR, type)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int countBuildingHouse(Long hid, Short type) {

		String sql = "select count(*) from building.buildingHouse where hid = :hid and type = :type";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("hid", hid).setShort("type", type).uniqueResult();

		return count.intValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			query.alias("house", "house");

			if ("villageNo".equals(filter.getField())) {
				query.alias("house.village", "village");
				query.add(query.getCriterion("village.no", filter));
			} else if ("orientation".equals(field)) {
				query.add(query.getCriterion("house.orientation", Short.valueOf(data), op));
			} else if ("roomNum".equals(field)) {
				if (data.equals("6")) {
					query.add(Restrictions.ge("house.roomNum", Integer.valueOf(data)));
				} else {
					query.add(query.getCriterion("house.roomNum", Integer.valueOf(data), op));
				}
			} else if ("no".equals(field)) {
				query.add(query.getCriterion("no", data, op));
			} else if ("buildingArea".equals(field)) {
				String area[] = filter.getData().split("-");
				query.add(Restrictions.ge("house.buildArea", Integer.valueOf(area[0])));
				query.add(Restrictions.le("house.buildArea", Integer.valueOf(area[1])));
			} else if ("unitPrice".equals(field)) {
				String price[] = filter.getData().split("-");
				query.add(Restrictions.ge("unitPrice", Long.valueOf(price[0])));
				query.add(Restrictions.le("unitPrice", Long.valueOf(price[1])));
			} else if ("totalPrice".equals(field)) {
				String price[] = filter.getData().split("-");
				query.add(Restrictions.ge("totalPrice", Long.valueOf(price[0])));
				query.add(Restrictions.le("totalPrice", Long.valueOf(price[1])));
			} else if ("buildingHouseType".equals(field)) {
				query.add(query.getCriterion("type", Short.valueOf(data), op));
			} else if ("decorateDegree".equals(field)) {
				query.add(query.getCriterion("decorateDegree", Short.valueOf(data), op));
			} else if ("type".equals(field)) {
				query.add(query.getCriterion("house.type", Short.valueOf(data), op));
			} else if ("allowLoan".equals(field)) {
				query.add(query.getCriterion("allowLoan", Short.valueOf(data), op));
			} else if ("housingGrade".equals(field)) {
				query.add(query.getCriterion("housingGrade", data, op));
			} else if ("rentType".equals(field)) {
				query.add(query.getCriterion("rentType", Short.valueOf(data), op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("followUser".equals(field)) {
				query.alias("followUser", "followUser");
				query.add(query.getCriterion("followUser.uid", Long.valueOf(data), op));
			}
		}
	}

}
