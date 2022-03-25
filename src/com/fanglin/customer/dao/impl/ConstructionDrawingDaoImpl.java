package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.po.ConstructionDrawingPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.ConstructionDrawingDao;
import com.fanglin.utils.Paging;

@Repository("constructionDrawingOrderDao")
public class ConstructionDrawingDaoImpl extends DaoImpl<ConstructionDrawingPO> implements ConstructionDrawingDao {

	public ConstructionDrawingDaoImpl() {
		super(ConstructionDrawingPO.class);
	}

	@Override
	public List<ConstructionDrawingPO> queryCusConstructionDrawing(Paging paging, List<Filter> filters, long cid, short schedule) {

		PagingQuery<ConstructionDrawingPO> query = pagingQuery(paging, ConstructionDrawingPO.class);

		query.add(Restrictions.eq("cid", cid)).add(Restrictions.eq("schedule", schedule));

		return query.list();
	}

}
