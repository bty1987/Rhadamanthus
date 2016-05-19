/*
 * @File Name	: Paging.java
 * @Package		：com.fanglin.utils 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email		: 
 * Describing	: 分页结果的工具类
 */ 

package com.fanglin.utils;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;

public class Paging implements Serializable {

	private static final long serialVersionUID = -236455755726836664L;

	public static final int DEFAULT_MAX_RESULTS = 20;
	
	private Integer totalRecords = DEFAULT_MAX_RESULTS; // 符合查询条件的总记录数
	
	private List<?> data = Collections.EMPTY_LIST; // 查询结果
	
	private Integer page = 0;
	
	private Integer rows = DEFAULT_MAX_RESULTS;
	
	private Integer totalPage = DEFAULT_MAX_RESULTS;
	
	public Paging(){
		super();
	}

	public Paging(Integer page, Integer rows){
		super();
		this.page = page;
		this.rows = rows;
	}

	public List<?> getData(){
		return data;
	}

	public void setData(List<?> data){
		this.data = data;
	}

	public Integer getPage(){
		return page;
	}

	public void setPage(Integer page){
		this.page = page;
	}

	public Integer getRows(){
		return rows;
	}

	public void setRows(Integer rows){
		this.rows = rows;
	}

	public Integer getTotalRecords(){
		return totalRecords;
	}

	public void setTotalRecords(Integer totalRecords){
		this.totalRecords = totalRecords;
	}

	public Integer getTotalPage(){
		return totalPage;
	}

	public void setTotalPage(Integer totalPage){
		this.totalPage = totalPage;
	}

}
