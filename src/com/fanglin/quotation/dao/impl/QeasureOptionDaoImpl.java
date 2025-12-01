package com.fanglin.quotation.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QeasureOptionDao;
import com.fanglin.quotation.po.QeasureOptionPO;

@Repository("qeasureOptionDao")
public class QeasureOptionDaoImpl extends DaoImpl<QeasureOptionPO> implements QeasureOptionDao {

	public QeasureOptionDaoImpl() {
		super(QeasureOptionPO.class);
	}

	@Override
	public int deleteQeasureOption(long qmid, long qmfaid) {

		String sql = "delete from quotetion.qeasureoption where qmid = :qmid and qmfaid = :qmfaid";
		session().createSQLQuery(sql).setLong("qmid", qmid).setLong("qmfaid", qmfaid).executeUpdate();

		return 0;
	}

}
