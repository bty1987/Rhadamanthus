package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.TalkingPO;
import com.fanglin.utils.Paging;

public interface TalkingDao extends Dao<TalkingPO> {

	public List<TalkingPO> pageTalking(Paging paging, List<Filter> filters, int company);
	
	public List<TalkingPO> queryTalking(List<Short> type, int company);

}
