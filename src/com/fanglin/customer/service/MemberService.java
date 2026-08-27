package com.fanglin.customer.service;

import java.util.List;
import java.util.Map;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.MemberActivityVO;
import com.fanglin.customer.vo.MemberGoodsVO;
import com.fanglin.customer.vo.MemberOrderItemVO;
import com.fanglin.customer.vo.MemberOrderVO;
import com.fanglin.customer.vo.MemberPointDetailVO;
import com.fanglin.customer.vo.MemberPointVO;
import com.fanglin.customer.vo.MemberVO;

public interface MemberService {

	public Map<String, List<MemberVO>> queryMember(List<MemberVO> members) throws FLException;

	public List<MemberPointVO> queryMemberPoint(List<MemberPointVO> memberPointVOs);

	public List<MemberPointDetailVO> queryDecorationIntegralDetailByOrderId(String orderId);

	public List<MemberPointDetailVO> queryMaterialIntegralDetailByOrderId(String orderId);

	public int addMemberActivity(MemberActivityVO memberActivityVO, List<String> companys, String userId) throws FLException;

	public int makeMemberOrder(MemberOrderVO memberOrderVO, List<MemberOrderItemVO> memberOrderItemVOs, String userId) throws FLException;

	public int cancelMemberOrder(MemberOrderVO memberOrderVO, String userId) throws FLException;

	public int makeMemberOrderItem(MemberOrderVO memberOrderVO, MemberOrderItemVO memberOrderItemVO, String userId) throws FLException;

	public int cancelMemberOrderItem(MemberOrderVO memberOrderVO, MemberOrderItemVO memberOrderItemVO, String userId) throws FLException;

	public int updateMemberGoods(MemberGoodsVO memberGoodsVO);

	public Map<String, List<MemberVO>> queryMemberForInfo(List<MemberVO> members, Integer company) throws FLException;

}
