package com.fanglin.market.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.market.dao.CuserDao;
import com.fanglin.market.po.CuserPO;
import com.fanglin.market.service.CuserService;
import com.fanglin.market.vo.CuserVO;
import com.fanglin.utils.BeanUtil;

@Service("cuserService")
@Transactional(readOnly = true)
public class CuserServiceImpl implements CuserService {
	
	@Autowired
	private CuserDao cuserDao;

	@Override
	public CuserVO queryCuserByUnionId(CuserVO cuser) {
		
		CuserPO cuserPO = cuserDao.queryCuserByUnionId(cuser.getUnionId());
		
		CuserVO cuserVO = new CuserVO();
		
		BeanUtil.copyProperties(cuserPO, cuserVO);
		
		return cuserVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addCuser(CuserVO cuserVO) throws FLException {
		
		CuserPO cuserPO = cuserDao.queryCuserByUnionId(cuserVO.getUnionId());
		
		if(cuserPO != null){
			
			BeanUtil.copyProperties(cuserVO, cuserPO);
			
			cuserDao.update(cuserPO);
			
		}else{
			
			cuserPO = new CuserPO();
			
			BeanUtil.copyProperties(cuserVO, cuserPO);
			
			cuserDao.save(cuserPO);
			
			cuserVO.setCuid(cuserPO.getCuid());
		}

	}

}
