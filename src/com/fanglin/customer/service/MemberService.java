package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.MemberActivityVO;
import com.fanglin.customer.vo.MemberGoodsVO;
import com.fanglin.customer.vo.MemberOrderItemVO;
import com.fanglin.customer.vo.MemberOrderVO;
import com.fanglin.customer.vo.MemberPointVO;
import com.fanglin.customer.vo.MemberVO;

public interface MemberService {

	public List<MemberVO> queryMember(MemberVO memberVO) throws FLException;

	public List<MemberPointVO> queryMemberPoint(List<MemberPointVO> memberPointVOs);

	public int addMemberActivity(MemberActivityVO memberActivityVO, List<String> companys, String userId)  throws FLException;

	public int makeMemberOrder(MemberOrderVO memberOrderVO, List<MemberOrderItemVO> memberOrderItemVOs, String userId) throws FLException;

	public int cancelMemberOrder(MemberOrderVO memberOrderVO, String userId) throws FLException;

	public int updateMemberGoods(MemberGoodsVO memberGoodsVO);

	public List<MemberVO> queryMemberForInfo(MemberVO memberVO, Integer company) throws FLException;

}
