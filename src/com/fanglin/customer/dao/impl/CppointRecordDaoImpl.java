package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CppointRecordDao;
import com.fanglin.customer.po.CppointRecordPO;
import com.fanglin.utils.Paging;

@Repository("cppointRecordDao")
public class CppointRecordDaoImpl extends DaoImpl<CppointRecordPO> implements CppointRecordDao {

	public CppointRecordDaoImpl() {
		super(CppointRecordPO.class);
	}

	@Override
	public List<CppointRecordPO> queryCppointRecord(Long cpid, Paging paging, List<Filter> filters) {

		PagingQuery<CppointRecordPO> query = pagingQuery(paging, CppointRecordPO.class);

		query.add(Restrictions.eq(CppointRecordPO.COLUMN_CPID_STR, cpid));

		return query.list();
	}

}
