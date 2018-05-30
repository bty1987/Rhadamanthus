package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.fanglin.data.common.dao.LabelDao;
import com.fanglin.data.common.dao.UserlabelDao;
import com.fanglin.data.common.service.UserlabelService;
import com.fanglin.data.common.vo.LabelVO;
import com.fanglin.data.common.vo.UserlabelVO;
import com.fanglin.data.po.LabelPO;
import com.fanglin.data.po.UserlabelPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Service("userlabelService")
@Transactional(readOnly = true)
public class UserlabelServiceImpl implements UserlabelService {
	
	@Autowired
	private UserlabelDao userlabelDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private LabelDao labelDao;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updatelabelling(UserlabelVO userlabelVO, List<Integer> lids) {
		
		List<UserlabelPO> UserlabelPOs = userlabelDao.querylabelByuid(userlabelVO.getUser().getUid());
		for(UserlabelPO userlabelPO : UserlabelPOs){
			
			userlabelDao.delete(userlabelPO);
		}
		
		for(Integer lid : lids){
			
			UserlabelPO userlabelPO = new UserlabelPO();
			
			userlabelPO.setUser(userDao.get(userlabelVO.getUser().getUid()));
			
			LabelPO labelPO = labelDao.get(lid);
			
			userlabelPO.setValue(userlabelVO.getValue());
			userlabelPO.setLable(labelPO);
			
			labelDao.save(userlabelPO);
		}
	}

	@Override
	public List<UserlabelVO> querylabelByuid(UserlabelVO userlabelVO) {
		
		List<UserlabelPO> userlabelPOs = userlabelDao.querylabelByuid(userlabelVO.getUser().getUid());
		List<UserlabelVO> UserlabelVOs = new ArrayList<UserlabelVO>();
		
		for(UserlabelPO userlabelPO : userlabelPOs){
			
			UserlabelVO userlabelVOos = new UserlabelVO(new UserBaseVO(),new LabelVO());
		
			BeanUtil.copyPropertie(userlabelPO, userlabelVOos, Arrays.asList("user","label"));
			BeanUtil.copyPropertie(userlabelPO.getUser(), userlabelVOos.getUser(), Arrays.asList("duty","dept"));
			BeanUtil.copyPropertie(userlabelPO.getLable(), userlabelVOos.getLabel());
			
			UserlabelVOs.add(userlabelVOos);
		}
		
		
		return UserlabelVOs;
	}

	@Override
	public List<UserlabelVO> queryUserlabel() {
		
		List<UserlabelPO> userlabelPOs = userlabelDao.list();
		List<UserlabelVO> UserlabelVOs = new ArrayList<UserlabelVO>();
		
		for(UserlabelPO userlabelPO : userlabelPOs){
			
			UserlabelVO userlabelVO = new UserlabelVO(new UserBaseVO(),new LabelVO());
			
			BeanUtil.copyPropertie(userlabelPO, userlabelVO, Arrays.asList("user","label"));
			BeanUtil.copyPropertie(userlabelPO.getUser(), userlabelVO.getUser(), Arrays.asList("duty","dept"));
			BeanUtil.copyPropertie(userlabelPO.getLable(), userlabelVO.getLabel());
			
			UserlabelVOs.add(userlabelVO);
			
		}
		
		return UserlabelVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void sevalabelling(UserlabelVO userlabelVO) {
		
		UserlabelPO userlabelPOs = new UserlabelPO();
		
		userlabelPOs.setUser(new UserPO(userlabelVO.getUser().getUid()));
		userlabelPOs.setLable(new LabelPO(userlabelVO.getLabel().getLid()));
		userlabelPOs.setValue(userlabelVO.getValue());
		
		userlabelDao.save(userlabelPOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deletelabelling(UserlabelVO userlabelVO) {
		
		UserlabelPO userlabelPO = userlabelDao.get(userlabelVO.getUlid());
		
		userlabelDao.delete(userlabelPO);
		
	}

	@Override
	public List<UserlabelVO> queryUserLbaelBylids(List<Integer> lids) {
		List<UserlabelPO> userlabelPOs = userlabelDao.queryUserLbaelBylids(lids);
		List<UserlabelVO> UserlabelVOs = new ArrayList<UserlabelVO>();
		
		for(UserlabelPO userlabelPO : userlabelPOs){
			
			UserlabelVO userlabelVO = new UserlabelVO(new UserBaseVO(),new LabelVO());
			
			BeanUtil.copyPropertie(userlabelPO, userlabelVO, Arrays.asList("user","label"));
			BeanUtil.copyPropertie(userlabelPO.getUser(), userlabelVO.getUser(), Arrays.asList("duty","dept"));
			BeanUtil.copyPropertie(userlabelPO.getLable(), userlabelVO.getLabel());
			
	
			UserlabelVOs.add(userlabelVO);
			
		}
		return UserlabelVOs;
	}

	@Override
	public List<UserlabelVO> queryUserLabelByUidValue(UserlabelVO userlabelVO) {
		
		List<UserlabelPO> userlabelPOs = userlabelDao.queryUserLabelByUidValue(userlabelVO.getUser().getUid());
		List<UserlabelVO> UserlabelVOs = new ArrayList<UserlabelVO>();
		
		for(UserlabelPO userlabelPO : userlabelPOs){
			
			UserlabelVO userlabelVOos = new UserlabelVO(new UserBaseVO(),new LabelVO());
			
			BeanUtil.copyPropertie(userlabelPO, userlabelVOos, Arrays.asList("user","label"));
			BeanUtil.copyPropertie(userlabelPO.getUser(), userlabelVOos.getUser(), Arrays.asList("duty","dept"));
			BeanUtil.copyPropertie(userlabelPO.getLable(), userlabelVOos.getLabel());
			
	
			UserlabelVOs.add(userlabelVOos);
			
		}
		
		return UserlabelVOs;
	}

}
