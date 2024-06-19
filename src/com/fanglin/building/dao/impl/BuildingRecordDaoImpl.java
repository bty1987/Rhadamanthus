package com.fanglin.building.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.building.dao.BuildingRecordDao;
import com.fanglin.building.po.BuildingRecordPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("buildingRecordDao")
public class BuildingRecordDaoImpl extends DaoImpl<BuildingRecordPO> implements BuildingRecordDao {

	public BuildingRecordDaoImpl() {
		super(BuildingRecordPO.class);
	}

	@Override
	public List<BuildingRecordPO> queryBuildingRecord(List<Filter> filters) {

		PagingQuery<BuildingRecordPO> query = pagingQuery(new Paging(), BuildingRecordPO.class);

		if (filters != null) {
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();

				if (field.equals("hsid")) {
					query.alias("buildingHouse", "buildingHouse").add(Restrictions.eq(BuildingRecordPO.COLUMN_HSID_STR, Long.valueOf(data)));
				} else if (field.equals("csid")) {
					query.alias("customerSource", "customerSource").add(Restrictions.eq(BuildingRecordPO.COLUMN_CSID_STR, Long.valueOf(data)));
				} else if (field.equals("type")) {
					query.add(Restrictions.eq(BuildingRecordPO.COLUMN_TYPE_STR, Long.valueOf(data)));
				}
			}
		}

		query.notPaging();

		return query.list();

	}

}
