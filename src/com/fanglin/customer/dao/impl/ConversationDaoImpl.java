package com.fanglin.customer.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.ConversationDao;
import com.fanglin.customer.po.ConversationPO;
import com.fanglin.utils.Paging;

@Repository("conversationDao")
public class ConversationDaoImpl extends DaoImpl<ConversationPO> implements ConversationDao {

	public ConversationDaoImpl() {
		super(ConversationPO.class);
	}

	@Override
	public List<ConversationPO> pageConversation(Paging paging, List<Filter> filters) {

		PagingQuery<ConversationPO> query = pagingQuery(paging, ConversationPO.class);

		queryFilterExecute(query, filters);

		query.desc("cid");

		return query.list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();
			if ("orderId".equals(field)) {
				query.add(query.getCriterion("orderId", data, op));
			}
		}

	}

}
