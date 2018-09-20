package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.EmemberDao;
import com.fanglin.customer.po.EmemberPO;
import com.fanglin.customer.service.EmemberService;
import com.fanglin.customer.vo.EmemberVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("ememberService")
@Transactional(readOnly=true)
public class EmemberServiceImpl implements EmemberService{
	
	@Autowired
	private EmemberDao ememberDao;
	
	@Override
	public void pageEmember(Paging paging, List<Filter> filters) {
		
		List<EmemberPO> ememberPOs = ememberDao.pageEmember(paging, filters);
		
		List<EmemberVO> ememberVOs = new ArrayList<EmemberVO>();
		
		for (EmemberPO ememberPO : ememberPOs) {
			
			EmemberVO ememberVO = new EmemberVO();
			
			BeanUtil.copyPropertie(ememberPO, ememberVO);
			
			ememberVOs.add(ememberVO);
			
		}
		
		paging.setData(ememberVOs);
		
	}

	@Override
	public EmemberVO queryEmember(EmemberVO ememberVO) {
		
		EmemberPO ememberPO = ememberDao.queryEmenber(ememberVO.getUnionId());
		
		ememberVO = new EmemberVO();
		
		if(ememberPO == null){
			return ememberVO;
		}
		
		BeanUtil.copyPropertie(ememberPO, ememberVO);
		
		return ememberVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addEmember(EmemberVO ememberVO,String securityCode,String verifyCode) throws FLException {
		
		try {
	        if(!verifyCode.equals(AESHelper.decryptString(securityCode, SystemConfig.getString("encryptKey")))){
	          throw new FLException(910131,"验证失败,重新验证");
	      }
	    } catch (Exception e) {
	      throw new FLException(910131,"验证失败,重新验证");
	    }
		
		EmemberPO ememberPO = ememberDao.queryEmenber(ememberVO.getUnionId());
		
		if(ememberPO != null){
			throw new FLException(111111, "电子会员已存在");
		}
		
		ememberPO = new EmemberPO();
		
		BeanUtil.copyPropertie(ememberVO, ememberPO);
		
		ememberPO.setStatus(EmemberPO.STATUS_INIT_SHORT);
		
		ememberDao.save(ememberPO);
		
		return 0;
	}

}
