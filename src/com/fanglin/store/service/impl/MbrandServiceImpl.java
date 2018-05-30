package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.MbrandDao;
import com.fanglin.store.dao.McategoryDao;
import com.fanglin.store.po.MbrandPO;
import com.fanglin.store.po.McategoryPO;
import com.fanglin.store.service.MbrandService;
import com.fanglin.store.vo.MbrandVO;
import com.fanglin.store.vo.McategoryVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("mbrandService")
@Transactional(readOnly = true)
public class MbrandServiceImpl implements MbrandService {
	
	@Autowired
	private MbrandDao mbrandDao;
	
	@Autowired
	private McategoryDao mcategoryDao;

	@Override
	public void pageMbrand(Paging paging, List<Filter> filters) {
		
		List<MbrandPO> mbrandPOs = mbrandDao.pageMbrand(paging, filters);
		List<MbrandVO> mbrandVOs = new ArrayList<MbrandVO>();
		
		for (MbrandPO mbrandPO : mbrandPOs) {
			mbrandVOs.add(mbrandPOToVO(mbrandPO));
		}
		
		paging.setData(mbrandVOs);
		
	}

	@Override
	public List<MbrandVO> queryMbrandByCid(MbrandVO mbrand) {
		
		List<MbrandPO> mbrandPOs = mbrandDao.queryMbrandByCid(mbrand.getMcategory().getCid());
		List<MbrandVO> mbrandVOs = new ArrayList<MbrandVO>();
		
		for (MbrandPO mbrandPO : mbrandPOs) {
			mbrandVOs.add(mbrandPOToVO(mbrandPO));
		}
		
		return mbrandVOs;
		
	}
	
	@Override
	public List<MbrandVO> queryMbrandByName(String pinyinName) {
		
		Paging paging = new Paging(0, 10);
		
		List<MbrandPO> mbrandPOs = mbrandDao.queryMbrandByName(paging, pinyinName);
		List<MbrandVO> mbrandVOs = new ArrayList<MbrandVO>();
		
		for (MbrandPO mbrandPO : mbrandPOs) {
			mbrandVOs.add(mbrandPOToVO(mbrandPO));
		}
		
		return mbrandVOs;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addMbrand(MbrandVO mbrandVO) throws FLException {
		
		List<MbrandPO> mbrandPOs = mbrandDao.queryMbrand();
		String name = mbrandVO.getName();
		
		for (MbrandPO mbrand : mbrandPOs) {
			if(name.equals(mbrand.getName())){
				throw new FLException(111111, "品牌已存在");
			}
		}
		
		McategoryPO mcategoryPO = mcategoryDao.get(mbrandVO.getMcategory().getCid());
		
		MbrandPO mbrandPO  = new MbrandPO(mcategoryPO);
		
		BeanUtil.copyProperties(mbrandVO, mbrandPO, Arrays.asList("mcategory"));
		
		mbrandDao.save(mbrandPO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMbrand(MbrandVO mbrand) throws FLException {
		
		MbrandPO mbrandPO = mbrandDao.get(mbrand.getBid());
		
		if(mbrandPO == null){
			throw new FLException(111111, "品牌不存在");
		}
		
		BeanUtil.copyProperties(mbrand, mbrandPO, Arrays.asList("mcategory", "status"));
		
		if(mbrand.getMcategory() != null){
			
			McategoryPO mcategoryPO = mcategoryDao.get(mbrand.getMcategory().getCid());
			
			mbrandPO.setMcategory(mcategoryPO);
			
		}
		
		mbrandDao.update(mbrandPO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMbrandForStatus(MbrandVO mbrand) throws FLException {
		
		MbrandPO mbrandPO = mbrandDao.get(mbrand.getBid());
		
		if(mbrandPO == null){
			throw new FLException(111111, "品牌不存在");
		}
		
		mbrandPO.setStatus(mbrand.getStatus());
		
		mbrandDao.update(mbrandPO);
		
	}
	
	public MbrandVO mbrandPOToVO(MbrandPO mbrandPO){
		
		MbrandVO mbrandVO = new MbrandVO(new McategoryVO());
		
		BeanUtil.copyProperties(mbrandPO, mbrandVO, Arrays.asList("mcategory"));
		
		BeanUtil.copyProperties(mbrandPO.getMcategory(), mbrandVO.getMcategory());
		
		return mbrandVO;
		
	}

}
