package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.FeedbackRecordPO;

public interface FeedbackRecordDao extends Dao<FeedbackRecordPO> {

	public List<FeedbackRecordPO> queryFeedbackRecord(long fid);

}
