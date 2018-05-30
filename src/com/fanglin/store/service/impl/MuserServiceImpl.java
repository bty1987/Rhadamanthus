package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.MuserDao;
import com.fanglin.store.po.MuserPO;
import com.fanglin.store.service.MuserService;
import com.fanglin.store.vo.MuserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("muserService")
@Transactional(readOnly = true)
public class MuserServiceImpl implements MuserService {
	
	@Autowired
	private MuserDao muserDao;

	@Override
	public void pageMuser(Paging paging, List<Filter> filters) {
		
		List<MuserPO> muserPOs = muserDao.pageMuser(paging, filters);
		List<MuserVO> muserVOs = new ArrayList<MuserVO>();
		
		for (MuserPO muserPO : muserPOs) {
			
			MuserVO muserVO = new MuserVO();
			
			BeanUtil.copyProperties(muserPO, muserVO);
			
			muserVOs.add(muserVO);
			
		}
		
		paging.setData(muserVOs);
		
	}
	
	@Override
	public List<MuserVO> queryMuserByPinyinName(String pinyinName) {
		
		Paging paging = new Paging(0, 10);
		
		List<MuserPO> muserPOs = muserDao.queryMuserByPinyinName(paging, pinyinName);
		List<MuserVO> muserVOs = new ArrayList<MuserVO>();
		
		for (MuserPO muserPO : muserPOs) {
			
			MuserVO muserVO = new MuserVO();
			
			BeanUtil.copyProperties(muserPO, muserVO);
			
			muserVOs.add(muserVO);
			
		}
		return muserVOs;
	} 

	@Override
	public MuserVO queryMuserByUid(MuserVO muser) {
		
		MuserPO muserPO = muserDao.get(muser.getUid());
		
		MuserVO muserVO = new MuserVO();
		
		BeanUtil.copyProperties(muserPO, muserVO);
		
		return muserVO;
	}
	
	@Override
	public MuserVO queryMuserByUnion(MuserVO muser) {
		
		MuserPO muserPO = muserDao.queryMuserByUnion(muser.getUnionVal());
		
		MuserVO muserVO = new MuserVO();
		
		BeanUtil.copyProperties(muserPO, muserVO);
		
		return muserVO;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addMuser(MuserVO muserVO) throws FLException {
		
		MuserPO muserPO = muserDao.queryMuserByUnion(muserVO.getUnionVal());
		
		if(muserPO != null){
			throw new FLException(190006, "人员已存在");
		}
		
		muserPO = new MuserPO();
		
		String name = getStringRandom(16);
		
		muserVO.setName(name);
		
		BeanUtil.copyProperties(muserVO, muserPO);
		
		muserDao.save(muserPO);
		
		muserVO.setUid(muserPO.getUid());
		
		muserVO.setName(muserPO.getName());

	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMuser(MuserVO muser) throws FLException {
		
		MuserPO muserPO = muserDao.get(muser.getUid());
		
		if(muserPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		BeanUtil.copyProperties(muser, muserPO);
		
		muserDao.update(muserPO);
		
	}
	
	public String getStringRandom(int length) {
		 
		 String val = "";
		 Random random = new Random();
		 
		 //参数length，表示生成几位随机数
		 for(int i = 0; i < length; i++){
			 String charOrNum = random.nextInt(2) % 2 == 0 ? "char" : "num";
			 if("char".equalsIgnoreCase(charOrNum)){
				 int temp = random.nextInt(2) % 2 == 0 ? 65 : 97;
				 val += (char)(random.nextInt(26) + temp);
			 }else if("num".equalsIgnoreCase(charOrNum)){
				 val += String.valueOf(random.nextInt(10));
			 }
		 }
		 
		 return val;
		 
	 }

}
