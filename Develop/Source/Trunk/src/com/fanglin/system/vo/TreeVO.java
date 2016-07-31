package com.fanglin.system.vo;

import java.io.Serializable;
import java.util.List;

public class TreeVO implements Serializable{
	                                                                
	private static final long serialVersionUID = 793543025076046420L;

	private int id;
	
	private String name;
	
	private String url;
	
	private String icon;
	
	private List<TreeVO> sub;

	public int getId(){
		return id;
	}

	public void setId(int id){
		this.id = id;
	}

	public String getName(){
		return name;
	}

	public void setName(String name){
		this.name = name;
	}

	public String getUrl(){
		return url;
	}

	public void setUrl(String url){
		this.url = url;
	}

	public String getIcon(){
		return icon;
	}

	public void setIcon(String icon){
		this.icon = icon;
	}

	public List<TreeVO> getSub(){
		return sub;
	}

	public void setSub(List<TreeVO> sub){
		this.sub = sub;
	}
}
