package com.fanglin.member.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.member.dao.MemberCardDao;
import com.fanglin.member.dao.MemberDetailDao;
import com.fanglin.member.po.MemberCardPO;
import com.fanglin.member.po.MemberDetailPO;
import com.fanglin.member.service.MemberDetailService;
import com.fanglin.member.vo.MemberCardVO;
import com.fanglin.member.vo.MemberDetailVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("memberDetailService")
@Transactional(readOnly = true)
public class MemberDetailServiceImpl  implements MemberDetailService {

	@Autowired
	private MemberDetailDao memberDetailDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private MemberCardDao memberCardDao;
	
	@Override
	public void pageMemberDetail(Paging paging, List<Filter> filters) {
		
		List<MemberDetailPO> memberDetailPOs = memberDetailDao.pageMemberDetail(paging, filters);
		List<MemberDetailVO> memberDetailVOs = new ArrayList<MemberDetailVO>();
		
		MemberDetailVO memberDetailVO;
		
		for(MemberDetailPO memberDetailPO: memberDetailPOs){
			memberDetailVO = new MemberDetailVO(new UserVO());
			BeanUtil.copyProperties(memberDetailPO, memberDetailVO, Arrays.asList("memberCard", "cuId"));
			BeanUtil.copyProperties(memberDetailPO.getCuId(), memberDetailVO.getCuId(), Arrays.asList("role","dept"));
			memberDetailVOs.add(memberDetailVO);
		}
		
		paging.setData(memberDetailVOs);
	}
	
	@Override
	public List<MemberDetailVO> queryMemberDetailByOrderId(MemberCardVO memberCardVO) {
		
		List<MemberDetailVO> memberDetailVOs= new ArrayList<MemberDetailVO>();
		List<MemberDetailPO> memberDetailPOs = memberDetailDao.queryMemberDetailByOrderId(memberCardVO.getOrderId());

		for(MemberDetailPO memberDetailPO: memberDetailPOs){
			
			MemberDetailVO _memberDetailVO = new MemberDetailVO(new UserVO());
			
			BeanUtil.copyProperties(memberDetailPO, _memberDetailVO, Arrays.asList("cuId"));
			
			_memberDetailVO.getCuId().setBaseInfo(memberDetailPO.getCuId());
			
			memberDetailVOs.add(_memberDetailVO);
		}

		return memberDetailVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addMemberDetail(MemberDetailVO memberDetailVO,String cuId) throws FLException {
		
		MemberDetailPO memberDetailPO = new MemberDetailPO(new MemberCardPO(),new UserPO());
		
		BeanUtil.copyProperties(memberDetailVO, memberDetailPO, Arrays.asList("memberCard", "cuId"));
		BeanUtil.copyProperties(memberDetailVO.getMemberCard(), memberDetailPO.getMemberCard());
		UserPO userPO = userDao.queryUserByUserId(cuId);
		memberDetailPO.setCuId(userPO);
		Timestamp nowTime = new Timestamp(System.currentTimeMillis());
		memberDetailPO.setCreateTime(nowTime.getTime());
		memberDetailPO.setPid(MemberDetailPO.COLUMN_PID_SHORT);
		
		if(memberDetailVO.getSubType() == MemberDetailPO.COLUMN_SUBTYPEPLUS_SHORT){
			memberDetailPO.setCredit(memberDetailVO.getCredit());
			
			
		}else if(memberDetailVO.getSubType() == MemberDetailPO.COLUMN_SUBTYPELESS_SHORT){
			memberDetailPO.setCredit(-memberDetailVO.getCredit());
		}
		
		memberDetailDao.save(memberDetailPO);
		
		MemberCardPO memberCard = memberCardDao.queryMemberCardByMcId(memberDetailVO.getMemberCard().getMcId());
		memberCard.setCredits(memberCard.getCredits() + memberDetailPO.getCredit());
		
		memberCardDao.update(memberCard);
		
		return 0;
	}

}
