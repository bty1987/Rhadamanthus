package com.fanglin.construction.dao.impl;

import java.util.List;
import org.springframework.stereotype.Repository;
import com.fanglin.construction.dao.ConstructionDiaryDao;
import com.fanglin.construction.po.ConstructionDiaryPO;
import com.fanglin.construction.vo.ConstructionDiaryVO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.impl.DecorationDaoImpl;
import com.fanglin.utils.Paging;

@Repository("constructionDiaryDao")
public class ConstructionDiaryDaoImpl extends DaoImpl<ConstructionDiaryPO> implements ConstructionDiaryDao {

	public ConstructionDiaryDaoImpl() {
		super(ConstructionDiaryPO.class);
	}

	@Override
	public List<ConstructionDiaryPO> pageConstructionDiary(Paging paging, List<Filter> filters, Integer company) throws FLException {

		PagingQuery<ConstructionDiaryPO> query = pagingQuery(paging, ConstructionDiaryPO.class);

		query.add(query.getCriterion("decoration.company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("csid");

		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionDiaryPO> queryConstructionDiary(ConstructionDiaryVO constructionDiaryVO) {
		return session().createCriteria(ConstructionDiaryPO.class).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {
		queryFilterExcute(query, filters, "");
	}

	public static void queryFilterExcute(PagingQuery<?> query, List<Filter> filters, String prefix) throws FLException {

		if (prefix == null) {
			prefix = "";
		}

		if (!"".equals(prefix)) {

			query.alias(prefix, prefix);
			prefix = String.format("%s.", prefix);
		}

		DecorationDaoImpl.queryFilterExcute(query, filters, "decoration");

	}
}
