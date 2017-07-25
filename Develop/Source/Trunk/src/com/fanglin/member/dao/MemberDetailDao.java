package com.fanglin.member.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.member.po.MemberDetailPO;
import com.fanglin.utils.Paging;

public interface MemberDetailDao  extends Dao<MemberDetailPO> {

	public List<MemberDetailPO> queryMemberDetailByMcId(long mcId);
	
	public List<MemberDetailPO> pageMemberDetail(Paging paging, List<Filter> filters);
	
}
