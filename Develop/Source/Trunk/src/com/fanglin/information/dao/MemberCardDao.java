package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.MemberCardPO;
import com.fanglin.utils.Paging;

public interface MemberCardDao  extends Dao<MemberCardPO> {

	public MemberCardPO queryMemberCardByOrderId(String orderId);
	
	public MemberCardPO queryMemberCardByMcId(long mcId);
	
	public MemberCardPO queryMemberCardByNo(String no);
	
	public List<MemberCardPO> pageMemberCard(Paging paging, List<Filter> filters);
	
}
