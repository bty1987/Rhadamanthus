package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.common.vo.LabelVO;
import com.fanglin.data.po.LabelPO;
import com.fanglin.personel.dao.UserLabelDao;
import com.fanglin.personel.po.UserLabelPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.UserLabelService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserLabelVO;
import com.fanglin.utils.BeanUtil;

@Service("userlabelService")
@Transactional(readOnly = true)
public class UserLabelServiceImpl implements UserLabelService {
	
	@Autowired
	private UserLabelDao userlabelDao;

	@Override
	public List<UserLabelVO> queryUserLabelByUid(UserLabelVO userlabelVO) {
		
		List<UserLabelPO> userlabelPOs = userlabelDao.queryUserLabelByUid(userlabelVO.getUser().getUid());
		List<UserLabelVO> userlabelVOs = new ArrayList<UserLabelVO>();
		
		for(UserLabelPO userlabelPO : userlabelPOs){
			
			userlabelVOs.add(UserlabelPOToVO(userlabelPO));
		}
		
		return userlabelVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addUserLabel(UserLabelVO userlabelVO) {
		
		UserLabelPO userlabelPOs = new UserLabelPO();
		
		userlabelPOs.setUser(new UserPO(userlabelVO.getUser().getUid()));
		userlabelPOs.setLabel(new LabelPO(userlabelVO.getLabel().getLid()));
		userlabelPOs.setScope(userlabelVO.getScope());
		
		userlabelDao.save(userlabelPOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteUserLabel(UserLabelVO userlabelVO) {
		
		userlabelDao.deleteById(userlabelVO.getUlid());
		
	}

	@Override
	public List<UserLabelVO> pickUserLabel(List<Integer> userLabel) {
		
		List<UserLabelPO> userlabelPOs = userlabelDao.pickUserLabel(userLabel);
		List<UserLabelVO> userlabelVOs = new ArrayList<UserLabelVO>();
		
		for(UserLabelPO userlabelPO : userlabelPOs){
			
			userlabelVOs.add(UserlabelPOToVO(userlabelPO));
			
		}
		return userlabelVOs;
	}
	
	private UserLabelVO UserlabelPOToVO(UserLabelPO userlabelPO){
		
		UserLabelVO userlabel = new UserLabelVO(new UserBaseVO(),new LabelVO());
		
		BeanUtil.copyPropertie(userlabelPO, userlabel, Arrays.asList("user","label"));
		BeanUtil.copyPropertie(userlabelPO.getUser(), userlabel.getUser(), Arrays.asList("duty","dept"));
		BeanUtil.copyPropertie(userlabelPO.getLabel(), userlabel.getLabel());
		
		return userlabel;
	}

}
