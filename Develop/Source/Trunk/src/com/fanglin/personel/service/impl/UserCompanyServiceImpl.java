package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserCompanyDao;
import com.fanglin.personel.po.UserCompanyPO;
import com.fanglin.personel.service.UserCompanyService;
import com.fanglin.personel.vo.UserCompanyVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;

@Service("userCompanyService")
@Transactional(readOnly = true)
public class UserCompanyServiceImpl implements UserCompanyService {
	
	@Autowired
	private UserCompanyDao userCompanyDao;
	
	@Override
	public List<UserCompanyVO> queryUserCompany(UserVO userVO) throws FLException {
	
		List<UserCompanyVO> userCompanyVOs = new ArrayList<UserCompanyVO>();
		List<UserCompanyPO> userCompanyPOs = userCompanyDao.queryUserCompany(userVO.getUid());
		
		UserCompanyVO userCompanyVO;
		
		for(UserCompanyPO userCompanyPO:userCompanyPOs){
			
			userCompanyVO = new UserCompanyVO();
			
			userCompanyVOs.add((UserCompanyVO)BeanUtil.copyPropertie(userCompanyPO, userCompanyVO));
			
		}
		
		return userCompanyVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateUserCompany(UserVO userVO, List<Integer> cids)throws FLException {
		
		int uid = userVO.getUid();
		
		userCompanyDao.deleteUserCompany(uid);
		
		if( cids !=null){
			for(Integer cid: cids) {
				userCompanyDao.save(new UserCompanyPO(uid, cid));	
			}
		}
		return 0;
	}
	
}
