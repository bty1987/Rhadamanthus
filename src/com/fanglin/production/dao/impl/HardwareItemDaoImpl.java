package com.fanglin.production.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.HardwareItemDao;
import com.fanglin.production.po.HardwareItemPO;
import com.fanglin.utils.Paging;

@Repository("hardwareItemDao")
public class HardwareItemDaoImpl extends DaoImpl<HardwareItemPO> implements HardwareItemDao {

	public HardwareItemDaoImpl() {
		super(HardwareItemPO.class);
	}

	@Override
	public List<HardwareItemPO> pageHardwareItemByHid(Paging paging, List<Filter> filters, long hid) {

		PagingQuery<HardwareItemPO> query = pagingQuery(paging, HardwareItemPO.class);

		query.add(getCriterion(HardwareItemPO.COLUMN_HID_STR, hid, "op"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	public void queryFilterExcute(PagingQuery<HardwareItemPO> query, List<Filter> filters) {
		if (filters != null) {

			for (Filter fliter : filters) {

				String field = fliter.getField();
				String data = fliter.getData();
				String op = fliter.getOp();

				if (HardwareItemPO.COLUMN_HID_STR.equals(field)) {
					query.add(query.getCriterion(field, Long.parseLong(data), op));
				}
			}
		}

	}

	@Override
	public int deleteHardwareItemByHid(long hid) {
		String sql = "delete from production.hardwareitem where hid = :hid";
		return session().createSQLQuery(sql).setLong("hid",hid).executeUpdate();
	}

}
