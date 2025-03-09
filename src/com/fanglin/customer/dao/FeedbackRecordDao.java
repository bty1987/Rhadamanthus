package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.FeedbackRecordPO;
import com.fanglin.utils.Paging;

public interface FeedbackRecordDao extends Dao<FeedbackRecordPO> {

	public List<FeedbackRecordPO> queryFeedbackRecord(long fid);
	
	public List<FeedbackRecordPO> queryFeedbackRecordByfids(Paging paging,List<Long> fids);
	
}
