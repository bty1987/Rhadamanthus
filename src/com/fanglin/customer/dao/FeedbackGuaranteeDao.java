package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.FeedbackGuaranteePO;

public interface FeedbackGuaranteeDao extends Dao<FeedbackGuaranteePO> {

	public List<FeedbackGuaranteePO> queryFeedbackGuarantee(long fid);

}
