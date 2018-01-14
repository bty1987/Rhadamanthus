package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.MemberCardVO;
import com.fanglin.information.vo.MemberDetailVO;
import com.fanglin.utils.Paging;

public interface MemberDetailService {
	
	public void pageMemberDetail(Paging paging, List<Filter> filters);

	public List<MemberDetailVO> queryMemberDetailByOrderId(MemberCardVO memberCardVO);
	
	public int addMemberDetail(MemberDetailVO memberDetailVO,String cuId) throws FLException;
}
