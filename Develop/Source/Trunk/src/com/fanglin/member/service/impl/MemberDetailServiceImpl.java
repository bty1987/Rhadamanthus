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
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
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
	
	@Autowired
	private SystemConfigDao systemConfigDao; 
	
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
		MemberCardPO memberCardPO = memberCardDao.queryMemberCardByOrderId(memberCardVO.getOrderId());
		List<MemberDetailPO> memberDetailPOs = memberDetailDao.queryMemberDetailByMcId(memberCardPO.getMcId());

		for(MemberDetailPO memberDetailPO: memberDetailPOs){
			
			MemberDetailVO _memberDetailVO = new MemberDetailVO(new UserVO());
			
			BeanUtil.copyProperties(memberDetailPO, _memberDetailVO, Arrays.asList("memberCard","cuId"));
			
			BeanUtil.copyProperties(memberDetailPO.getCuId(), _memberDetailVO.getCuId(), Arrays.asList("role","dept"));
			
			memberDetailVOs.add(_memberDetailVO);
		}

		return memberDetailVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addMemberDetail(MemberDetailVO memberDetailVO,String cuId) throws FLException {
		
		MemberDetailPO memberDetailPO = new MemberDetailPO(new MemberCardPO(),new UserPO());
		
		String systemKey = "integralmultiple";
		SystemConfigPO systemConfig = systemConfigDao.querySystemConfigByKey(systemKey);
		
		BeanUtil.copyProperties(memberDetailVO, memberDetailPO, Arrays.asList("memberCard", "cuId"));
		BeanUtil.copyProperties(memberDetailVO.getMemberCard(), memberDetailPO.getMemberCard());
		UserPO userPO = userDao.queryUserByUserId(cuId);
		memberDetailPO.setCuId(userPO);
		Timestamp nowTime = new Timestamp(System.currentTimeMillis());
		memberDetailPO.setCreateTime(nowTime.getTime());
		memberDetailPO.setBalance(MemberDetailPO.BALANCE_ZERO_INT);
		memberDetailPO.setMultiple(Integer.valueOf(systemConfig.getValue()));
		memberDetailPO.setDivider(MemberDetailPO.BALANCE_ZERO_INT);
		memberDetailPO.setPid(MemberDetailPO.PID_INIT_SHORT);
		
		if(memberDetailVO.getSubType() == MemberDetailPO.SUBTYPE_PLUS_INT){
			memberDetailPO.setCredit(memberDetailVO.getCredit());
			
			
		}else if(memberDetailVO.getSubType() == MemberDetailPO.SUBTYPE_LESS_INT){
			memberDetailPO.setCredit(-memberDetailVO.getCredit());
		}
		
		memberDetailDao.save(memberDetailPO);
		
		MemberCardPO memberCard = memberCardDao.queryMemberCardByMcId(memberDetailVO.getMemberCard().getMcId());
		memberCard.setCredits(memberCard.getCredits() + memberDetailPO.getCredit());
		
		memberCardDao.update(memberCard);
		
		return 0;
	}

}
