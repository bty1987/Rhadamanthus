package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.ConversationPO;
import com.fanglin.utils.Paging;

public interface ConversationDao extends Dao<ConversationPO> {

	public List<ConversationPO> pageConversation(Paging paging, List<Filter> filters);

}
