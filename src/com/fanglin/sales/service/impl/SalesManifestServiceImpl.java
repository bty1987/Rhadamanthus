package com.fanglin.sales.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.sales.service.SalesManifestService;

@Service("salesManifestService")
@Transactional(readOnly=true)
public class SalesManifestServiceImpl implements SalesManifestService{
	
}
