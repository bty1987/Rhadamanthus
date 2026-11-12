package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.NormChangeRecordDao;
import com.fanglin.quotation.po.NormChangeRecordPO;
import com.fanglin.quotation.vo.NormChangeRecordVO;
import com.fanglin.utils.Paging;

@Repository("normChangeRecordDao")
public class NormChangeRecordDaoImpl extends DaoImpl<NormChangeRecordPO> implements NormChangeRecordDao {

	public NormChangeRecordDaoImpl() {
		super(NormChangeRecordPO.class);
	}

	@Override
	public List<NormChangeRecordPO> pageNormChangeRecord(Paging paging, NormChangeRecordVO condition) {

		PagingQuery<NormChangeRecordPO> query = pagingQuery(paging, NormChangeRecordPO.class);

		if (condition != null) {

			if (condition.getOrderId() != null && condition.getOrderId().length() > 0) {
				query.add(query.getCriterion("orderId", condition.getOrderId(), "eq"));
			}

			if (condition.getQid() != null) {
				query.add(query.getCriterion("qid", condition.getQid(), "eq"));
			}

			if (condition.getRefId() != null) {
				query.add(query.getCriterion("refId", condition.getRefId(), "eq"));
			}

			if (condition.getType() != null) {
				query.add(query.getCriterion("type", condition.getType(), "eq"));
			}

			if (condition.getChangeType() != null) {
				query.add(query.getCriterion("changeType", condition.getChangeType(), "eq"));
			}

			if (condition.getOperater() != null && condition.getOperater().length() > 0) {
				query.add(query.getCriterion("operater", condition.getOperater(), "eq"));
			}
		}

		query.desc("ncrId");

		return query.list();
	}

}
