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

	@Override
	@SuppressWarnings("unchecked")
	public List<ConversationPO> pageConversation(Paging paging, String orderId, long cid, String content) {

		int page = paging.getPage();
		int rows = paging.getRows();

		String colsql = "select * ";
		String amtsql = String.format(" from (select @rownum1/*'*/:= /*'*/@rownum1+1 rownum1, cs.*  from customer.conversation cs, (select @rownum1/*'*/:=/*'*/0) t where cs.content like '%%%s%%') t, customer.conversation cs", content);
		String amtsql2 = String.format(" from (select @rownum2/*'*/:= /*'*/@rownum2+1 rownum1, cs.*  from customer.conversation cs, (select @rownum2/*'*/:=/*'*/0) t where cs.content like '%%%s%%') t, customer.conversation cs", content);

		String rownumo = " SELECT @rownum1/*'*/:=/*'*/@rownum1 + 1 rownum, cs.* ";
		String rownumt = " SELECT @rownum2/*'*/:=/*'*/@rownum2 + 1 rownum, cs.* ";

		int rownum = ((Number) createSQLQuery(String.format("SELECT rownum from (%s %s WHERE cs.orderId = %s) t1 where t1.cid = %s", rownumo, amtsql, orderId, cid)).uniqueResult()).intValue();
		int current = rownum % rows + 1;

		int total = ((Number) createSQLQuery(String.format("SELECT count(*) %s", amtsql)).uniqueResult()).intValue();
		paging.setTotalRecords(total);

		int offset = total % (paging.getRows()) == 0 ? 0 : 1;
		paging.setTotalPage(total / (paging.getRows()) + offset);

		int beg = 0;
		int end = 0;
		if (page == 0) {
			page = current;
			paging.setPage(current);
		}

		double math = (double) rownum / (double) rows;
		math = math - 0.1;
		beg = (int) Math.floor(math) * rows - rows;
		end = (int) Math.ceil(math) * rows - rows;

		String sql = String.format("%s from (select rownum from (%s %s WHERE cs.orderId = %s) t1 where t1.cid = %s) tt1, (%s %s WHERE cs.orderId = %s) tt2 where tt2.rownum >= tt1.rownum + (%s) and tt2.rownum < tt1.rownum + (%s)", colsql, rownumo, amtsql, orderId, cid, rownumt, amtsql2, orderId, beg, end);

		return session().createQuery(sql).list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();
			if ("orderId".equals(field)) {
				query.add(query.getCriterion("orderId", data, op));
			} else if ("searTime".equals(field)) {
				query.timeranges("createTime", data);
			} else if (ConversationPO.COLUMN_CONTENT_STR.equals(field)) {
				query.add(query.getCriterion(ConversationPO.COLUMN_CONTENT_STR, data, op));
			}
		}

	}

}
