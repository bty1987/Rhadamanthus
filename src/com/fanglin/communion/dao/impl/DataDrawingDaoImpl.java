package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.DataDrawingDao;
import com.fanglin.communion.po.DataDrawingPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("dataDrawingDao")
public class DataDrawingDaoImpl extends DaoImpl<DataDrawingPO> implements DataDrawingDao {

	public DataDrawingDaoImpl() {
		super(DataDrawingPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DataDrawingPO> queryDataDrawing(Long sid, Short type) {

		return session().createCriteria(DataDrawingPO.class).add(Restrictions.eq(DataDrawingPO.COLUMN_SID_STR, sid)).add(Restrictions.eq(DataDrawingPO.COLUMN_TYPE_STR, type)).add(Restrictions.eq("status", DataDrawingPO.STATUS_INIT_INT)).list();

	}

	@Override
	public int batchSaveDataDrawing(long gid, long gpid, int cuid) {

		String sql = "INSERT INTO communion.datadrawing (sid, `name`, drawingUrl, drawingType, type, cuid, `status`) SELECT :gid, dd.`name`, dd.drawingUrl, dd.drawingType, 2, :cuid, dd.`status` FROM communion.datadrawing dd WHERE dd.sid = :gpid AND dd.type = 5";

		session().createSQLQuery(sql).setLong("gid", gid).setInteger("cuid", cuid).setLong("gpid", gpid).executeUpdate();

		return 0;

	}

}
